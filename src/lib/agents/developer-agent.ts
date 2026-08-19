import type { AgentInterface, AgentContext, AgentResult } from "@/types";

export class DeveloperAgent implements AgentInterface {
  readonly agentName = "developer" as const;
  readonly displayName = "Developer";

  async run(context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now();
    const { projectName, projectDescription, techStack, previousArtifacts, provider } = context;

    const archContext = previousArtifacts
      .filter((a) => a.type === "architecture" || a.type === "api-plan")
      .map((a) => `## ${a.title}\n${a.content}`)
      .join("\n\n");

    const componentPlanPrompt = `You are a senior DEVELOPER creating an implementation plan.

Project: ${projectName}
Description: ${projectDescription}
Tech Stack: ${techStack.join(", ")}

Architecture Context:
${archContext || "See project description above."}

Create a detailed component plan including:
1. Directory structure (tree format)
2. Design system primitives (Button, Input, Card, Modal, etc.)
3. Feature components with props definitions in TypeScript
4. Custom hooks with signatures and responsibilities
5. State management approach
6. Data fetching patterns
7. Form handling strategy

Format as professional markdown with TypeScript code examples.`;

    const componentPlanContent = await provider.complete(componentPlanPrompt, {
      maxTokens: 3000,
      systemPrompt: "You are a senior frontend developer creating detailed implementation plans.",
    });

    const techPlanPrompt = `You are a senior DEVELOPER writing implementation strategy.

Project: ${projectName}
Tech Stack: ${techStack.join(", ")}

Write a technical implementation guide covering:
1. Development environment setup
2. Project configuration (TypeScript, ESLint, Prettier)
3. Database migration strategy
4. Authentication implementation details
5. Error handling patterns
6. Testing approach per layer
7. Performance optimization techniques
8. CI/CD pipeline configuration
9. Environment variable management
10. Deployment checklist

Include concrete code examples for each section.`;

    const techPlanContent = await provider.complete(techPlanPrompt, {
      maxTokens: 2500,
    });

    const durationMs = Date.now() - startTime;

    return {
      status: "completed",
      artifacts: [
        {
          agentName: "developer",
          type: "component-plan",
          title: "Component Architecture",
          content: componentPlanContent,
        },
        {
          agentName: "developer",
          type: "tech-plan",
          title: "Implementation Guide",
          content: techPlanContent,
        },
      ],
      summary: "Component plan and implementation strategy generated",
      durationMs,
    };
  }
}
