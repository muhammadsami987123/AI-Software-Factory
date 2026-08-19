import type { AgentInterface, AgentContext, AgentResult } from "@/types";

export class QAAgent implements AgentInterface {
  readonly agentName = "qa" as const;
  readonly displayName = "QA Engineer";

  async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const { projectName, projectDescription, techStack, previousArtifacts, provider } = context;

    const previousContext = previousArtifacts
      .filter((a) => ["requirements", "user-stories", "api-plan"].includes(a.type))
      .map((a) => `## ${a.title}\n${a.content.slice(0, 1000)}`)
      .join("\n\n");

    const testPlanPrompt = `You are a senior QA ENGINEER creating a test plan.

Project: ${projectName}
Description: ${projectDescription}
Tech Stack: ${techStack.join(", ")}

Previous Work:
${previousContext || "See project description above."}

Create a comprehensive test plan including:
1. Testing philosophy and pyramid (unit/integration/E2E ratio)
2. Unit tests with TypeScript/Vitest code examples
3. Integration tests for API endpoints
4. E2E test scenarios using Playwright
5. Test coverage targets by layer
6. Performance testing approach
7. Security testing checklist

Format as professional markdown with executable test code examples.`;

    const testPlanContent = await provider.complete(testPlanPrompt, {
      maxTokens: 3000,
      systemPrompt: "You are a senior QA engineer writing comprehensive test documentation.",
    });

    const edgeCasesPrompt = `You are a QA ENGINEER identifying edge cases.

Project: ${projectName}
Description: ${projectDescription}

Identify and document edge cases for:
1. Authentication flows (login, logout, token expiry, concurrent sessions)
2. Data validation (empty inputs, max lengths, special characters, XSS attempts)
3. Network conditions (timeouts, offline, slow connections, 5xx errors)
4. Concurrent access (race conditions, optimistic locking, stale data)
5. UI/UX edge cases (empty states, very long text, many records, mobile)
6. Business logic boundaries (limits, quotas, permissions)

For each edge case: describe the scenario, expected behavior, and test approach.`;

    const edgeCasesContent = await provider.complete(edgeCasesPrompt, {
      maxTokens: 2000,
    });

    const durationMs = Date.now() - startTime;

    return {
      status: "completed",
      artifacts: [
        {
          agentName: "qa",
          type: "test-plan",
          title: "Test Plan",
          content: testPlanContent,
        },
        {
          agentName: "qa",
          type: "edge-cases",
          title: "Edge Cases Analysis",
          content: edgeCasesContent,
        },
      ],
      summary: "Test plan and edge case analysis completed",
      durationMs,
    };
  }
}
