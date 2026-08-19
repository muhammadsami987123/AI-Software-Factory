import type { AgentInterface, AgentContext, AgentResult } from "@/types";

export class ReviewerAgent implements AgentInterface {
  readonly agentName = "reviewer" as const;
  readonly displayName = "Code Reviewer";

  async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const { projectName, projectDescription, techStack, previousArtifacts, provider } = context;

    const allContext = previousArtifacts
      .map((a) => `## ${a.title}\n${a.content.slice(0, 800)}`)
      .join("\n\n");

    const reviewPrompt = `You are a senior REVIEWER reviewing a software project plan.

Project: ${projectName}
Description: ${projectDescription}
Tech Stack: ${techStack.join(", ")}

Review all artifacts:
${allContext || "See project description above."}

Produce a comprehensive review including:
1. Overall assessment (strengths and areas for improvement)
2. Code quality analysis with before/after examples
3. Security assessment table (checks with pass/fail status)
4. Performance optimization opportunities
5. Maintainability score (0-10) per dimension
6. Final recommendations (must-do, should-do, nice-to-have)

Format as professional markdown.`;

    const reviewContent = await provider.complete(reviewPrompt, {
      maxTokens: 3000,
      systemPrompt: "You are a senior code reviewer and technical lead providing constructive, actionable feedback.",
    });

    const recommendationsPrompt = `You are a senior REVIEWER writing final recommendations.

Project: ${projectName}
Tech Stack: ${techStack.join(", ")}

Write a prioritized list of recommendations covering:
1. Pre-launch blockers (must fix)
2. First-sprint improvements (high value)
3. Technical debt to address (medium term)
4. Future architectural considerations
5. Team and process recommendations

For each recommendation: priority, effort estimate, impact level, and implementation notes.`;

    const recommendationsContent = await provider.complete(recommendationsPrompt, {
      maxTokens: 2000,
    });

    const durationMs = Date.now() - startTime;

    return {
      status: "completed",
      artifacts: [
        {
          agentName: "reviewer",
          type: "review-summary",
          title: "Code Review",
          content: reviewContent,
        },
        {
          agentName: "reviewer",
          type: "recommendations",
          title: "Recommendations",
          content: recommendationsContent,
        },
      ],
      summary: "Code quality review and recommendations completed",
      durationMs,
    };
  }
}
