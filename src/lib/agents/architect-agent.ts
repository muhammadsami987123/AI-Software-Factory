import type { AgentInterface, AgentContext, AgentResult } from "@/types";

export class ArchitectAgent implements AgentInterface {
  readonly agentName = "architect" as const;
  readonly displayName = "Software Architect";

  async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const { projectName, projectDescription, techStack, previousArtifacts, provider } = context;

    const requirementsContext = previousArtifacts
      .filter((a) => a.type === "requirements")
      .map((a) => a.content)
      .join("\n\n");

    const architecturePrompt = `You are a senior ARCHITECT designing a system.

Project: ${projectName}
Description: ${projectDescription}
Tech Stack: ${techStack.join(", ")}

Requirements Context:
${requirementsContext || "See project description above."}

Create a comprehensive architecture document including:
1. High-level architecture diagram (ASCII)
2. Component breakdown (frontend, backend, data layers)
3. Database schema with SQL CREATE TABLE statements
4. API structure with endpoint listing
5. Security architecture
6. Deployment topology

Format as professional markdown.`;

    const architectureContent = await provider.complete(architecturePrompt, {
      maxTokens: 3500,
      systemPrompt: "You are a senior software architect creating technical architecture documents.",
    });

    const apiPlanPrompt = `You are a senior ARCHITECT planning API endpoints.

Project: ${projectName}
Tech Stack: ${techStack.join(", ")}

Design a complete REST API plan with:
1. Authentication endpoints (register, login, refresh, logout)
2. Core resource endpoints (full CRUD)
3. Analytics/reporting endpoints
4. Webhook/integration endpoints
5. Request/response schemas for key endpoints
6. Error response format
7. Rate limiting strategy
8. Versioning strategy

Format as professional markdown with code examples.`;

    const apiPlanContent = await provider.complete(apiPlanPrompt, {
      maxTokens: 2500,
    });

    const durationMs = Date.now() - startTime;

    return {
      status: "completed",
      artifacts: [
        {
          agentName: "architect",
          type: "architecture",
          title: "System Architecture",
          content: architectureContent,
        },
        {
          agentName: "architect",
          type: "api-plan",
          title: "API Design",
          content: apiPlanContent,
        },
      ],
      summary: "System architecture, database schema, and API design completed",
      durationMs,
    };
  }
}
