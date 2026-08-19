import type { AgentName, FactoryRun, AIMode } from "@/types";
import * as db from "@/lib/db";
import { createProvider } from "@/lib/ai";
import { ProductAgent } from "./product-agent";
import { ArchitectAgent } from "./architect-agent";
import { DeveloperAgent } from "./developer-agent";
import { QAAgent } from "./qa-agent";
import { ReviewerAgent } from "./reviewer-agent";

const AGENT_CLASSES = [
  ProductAgent,
  ArchitectAgent,
  DeveloperAgent,
  QAAgent,
  ReviewerAgent,
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo mode: inter-agent delay to simulate pipeline transitions
const PIPELINE_GAP_MS = 800;

export async function executeRun(runId: string): Promise<void> {
  const run = db.getRun(runId);
  if (!run) throw new Error(`Run ${runId} not found`);

  const project = db.getProject(run.projectId);
  if (!project) throw new Error(`Project ${run.projectId} not found`);

  // Create all agent tasks upfront
  const tasks = db.createAgentTasks(runId);

  // Emit run started event
  db.createEvent({
    runId,
    eventType: "run_started",
    message: `Factory run started in ${run.mode.toUpperCase()} mode`,
  });

  // Update project status
  db.updateProjectStatus(run.projectId, "running");

  // Create AI provider
  const settings = db.getSettings();
  const provider = createProvider(run.mode as AIMode, {
    apiKey:
      run.mode === "anthropic"
        ? settings.anthropicApiKey ?? undefined
        : settings.openaiApiKey ?? undefined,
    model:
      run.mode === "anthropic"
        ? settings.anthropicModel
        : settings.openaiModel,
  });

  const previousArtifacts = [];
  let overallSuccess = true;

  for (let i = 0; i < AGENT_CLASSES.length; i++) {
    const AgentClass = AGENT_CLASSES[i];
    const agent = new AgentClass();
    const task = tasks.find((t) => t.agentName === agent.agentName);
    if (!task) continue;

    // Small gap between agents
    if (i > 0) await sleep(PIPELINE_GAP_MS);

    // Mark task as running
    db.updateTaskStarted(task.id);

    db.createEvent({
      runId,
      agentName: agent.agentName,
      eventType: "agent_started",
      message: `${agent.displayName} started`,
    });

    const context = {
      projectId: project.id,
      runId,
      projectName: project.name,
      projectDescription: project.description,
      techStack: project.techStack,
      previousArtifacts: [...previousArtifacts],
      provider,
    };

    try {
      // For demo mode, emit progress events mid-execution
      let progressEmitted = false;
      const progressTimer =
        run.mode === "demo"
          ? setInterval(() => {
              if (!progressEmitted) {
                progressEmitted = true;
                db.createEvent({
                  runId,
                  agentName: agent.agentName,
                  eventType: "agent_progress",
                  message: getProgressMessage(agent.agentName),
                });
              }
            }, 2500)
          : null;

      const result = await agent.run(context);

      if (progressTimer) clearInterval(progressTimer);

      // Save artifacts
      for (const artifact of result.artifacts) {
        const saved = db.createArtifact({
          runId,
          agentName: agent.agentName,
          type: artifact.type,
          title: artifact.title,
          content: artifact.content,
        });
        previousArtifacts.push(saved);

        db.createEvent({
          runId,
          agentName: agent.agentName,
          eventType: "artifact_created",
          message: `Artifact created: ${artifact.title}`,
        });
      }

      // Update task
      db.updateTaskCompleted(task.id, result.summary, result.durationMs);

      db.createEvent({
        runId,
        agentName: agent.agentName,
        eventType: "agent_completed",
        message: `${agent.displayName} completed — ${result.summary}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      db.updateTaskFailed(task.id, message);
      db.createEvent({
        runId,
        agentName: agent.agentName,
        eventType: "agent_failed",
        message: `${agent.displayName} failed: ${message}`,
      });
      overallSuccess = false;
      // Continue pipeline with partial context
    }
  }

  // Finalize run
  const finalStatus: FactoryRun["status"] = overallSuccess ? "completed" : "failed";
  db.updateRunStatus(runId, finalStatus);
  db.updateProjectStatus(run.projectId, finalStatus === "completed" ? "completed" : "failed");

  db.createEvent({
    runId,
    eventType: overallSuccess ? "run_completed" : "run_failed",
    message: overallSuccess
      ? "All agents completed. Factory run finished successfully."
      : "Factory run finished with some failures.",
  });
}

function getProgressMessage(agentName: AgentName): string {
  const messages: Record<AgentName, string> = {
    product: "Analyzing requirements and generating user stories...",
    architect: "Designing system architecture and database schema...",
    developer: "Planning component structure and implementation strategy...",
    qa: "Identifying test scenarios and edge cases...",
    reviewer: "Reviewing code quality and security posture...",
  };
  return messages[agentName];
}
