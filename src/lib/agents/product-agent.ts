import type { AgentInterface, AgentContext, AgentResult } from "@/types";

export class ProductAgent implements AgentInterface {
  readonly agentName = "product" as const;
  readonly displayName = "Product Manager";

  async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const { projectName, projectDescription, techStack, provider } = context;

    const prompt = `You are a senior PRODUCT_MANAGER creating a requirements document.

Project: ${projectName}
Description: ${projectDescription}
Tech Stack: ${techStack.join(", ")}

Generate a comprehensive requirements document including:
1. Executive summary
2. Functional requirements (FR-001 through FR-005)
3. Non-functional requirements (performance, security, scalability)
4. Detailed user stories with Given/When/Then format
5. Feature breakdown table with priorities and sprint estimates

Format as professional markdown.`;

    const requirementsContent = await provider.complete(prompt, {
      maxTokens: 3000,
      systemPrompt: "You are a senior product manager creating professional software requirements documents.",
    });

    const userStoriesPrompt = `You are a senior PRODUCT_MANAGER writing user stories.

Project: ${projectName}
Description: ${projectDescription}

Write 8-12 detailed user stories in this format:
**US-XXX: [Title]**
As a [role], I want to [action] so that [benefit].
Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Cover: authentication, core features, admin capabilities, edge cases.`;

    const userStoriesContent = await provider.complete(userStoriesPrompt, {
      maxTokens: 2000,
    });

    const durationMs = Date.now() - startTime;

    return {
      status: "completed",
      artifacts: [
        {
          agentName: "product",
          type: "requirements",
          title: "Requirements Document",
          content: requirementsContent,
        },
        {
          agentName: "product",
          type: "user-stories",
          title: "User Stories",
          content: userStoriesContent,
        },
      ],
      summary: "Requirements analyzed, user stories and feature breakdown generated",
      durationMs,
    };
  }
}
