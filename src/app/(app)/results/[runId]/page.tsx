import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArtifactViewer } from "@/components/results/ArtifactViewer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle, RotateCcw, Plus, ExternalLink } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = db.getRun(runId);
  if (!run) notFound();

  const project = db.getProject(run.projectId);
  if (!project) notFound();

  const artifacts = db.getArtifactsForRun(runId);
  const tasks = db.getTasksForRun(runId);
  const events = db.getEventsForRun(runId);

  const completedAgents = tasks.filter((t) => t.status === "completed").length;
  const totalDuration = tasks.reduce((acc, t) => acc + (t.durationMs ?? 0), 0);
  const startedAt = run.startedAt ? new Date(run.startedAt) : null;
  const completedAt = run.completedAt ? new Date(run.completedAt) : null;
  const wallTimeMs = startedAt && completedAt ? completedAt.getTime() - startedAt.getTime() : null;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <Header
        title="Results"
        description={project.name}
        action={
          <div className="flex gap-2">
            <Link href="/projects/new">
              <Button size="sm" variant="secondary">
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
            </Link>
            <Link href={`/projects/${project.id}`}>
              <Button size="sm" variant="secondary">
                <RotateCcw className="h-3.5 w-3.5" />
                Run Again
              </Button>
            </Link>
          </div>
        }
      />

      {/* Summary bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {run.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <div>
              <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{project.description.slice(0, 80)}...</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-zinc-100">{artifacts.length}</div>
              <div className="text-xs text-zinc-500">Artifacts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-100">{completedAgents}/5</div>
              <div className="text-xs text-zinc-500">Agents</div>
            </div>
            {wallTimeMs !== null && (
              <div>
                <div className="text-xl font-bold text-zinc-100">{(wallTimeMs / 1000).toFixed(0)}s</div>
                <div className="text-xs text-zinc-500">Total Time</div>
              </div>
            )}
            <Badge
              variant={run.status === "completed" ? "success" : "error"}
              dot
            >
              {run.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Agent performance */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tasks.map((task) => {
          const AGENT_NAMES: Record<string, string> = {
            product: "Product",
            architect: "Architect",
            developer: "Developer",
            qa: "QA",
            reviewer: "Reviewer",
          };
          return (
            <div
              key={task.id}
              className={`bg-zinc-900 border rounded-xl p-3 text-center ${
                task.status === "completed"
                  ? "border-emerald-500/20"
                  : task.status === "failed"
                  ? "border-red-500/20"
                  : "border-zinc-800"
              }`}
            >
              <div className="text-xs font-semibold text-zinc-300 mb-1">
                {AGENT_NAMES[task.agentName]}
              </div>
              <div className={`text-xs font-medium ${
                task.status === "completed" ? "text-emerald-400" :
                task.status === "failed" ? "text-red-400" : "text-zinc-500"
              }`}>
                {task.status === "completed" && task.durationMs
                  ? `${(task.durationMs / 1000).toFixed(1)}s`
                  : task.status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Artifacts viewer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-200">Generated Artifacts</span>
          <span className="text-xs text-zinc-500">{artifacts.length} documents</span>
        </div>
        <div className="p-5">
          <ArtifactViewer artifacts={artifacts} tasks={tasks} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-800">
          <span className="text-sm font-semibold text-zinc-200">Factory Timeline</span>
        </div>
        <div className="p-5 max-h-64 overflow-y-auto space-y-1.5 font-mono text-xs">
          {events.map((event) => {
            const time = new Date(event.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            });
            const color =
              event.eventType.includes("completed") ? "text-emerald-400" :
              event.eventType.includes("failed") ? "text-red-400" :
              event.eventType.includes("started") ? "text-blue-400" :
              event.eventType === "artifact_created" ? "text-violet-400" :
              "text-zinc-400";
            return (
              <div key={event.id} className="flex gap-3">
                <span className="text-zinc-600 shrink-0 tabular-nums">{time}</span>
                <span className={color}>{event.message}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
