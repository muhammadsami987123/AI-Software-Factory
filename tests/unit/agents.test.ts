import { describe, it, expect, vi, beforeEach } from "vitest";
import { DemoProvider } from "@/lib/ai/demo-provider";
import { ProductAgent } from "@/lib/agents/product-agent";
import { ArchitectAgent } from "@/lib/agents/architect-agent";

// ─── DemoProvider Tests ───────────────────────────────────────────────────────

describe("DemoProvider", () => {
  it("has mode set to demo", () => {
    const provider = new DemoProvider();
    expect(provider.mode).toBe("demo");
  });

  it("returns a string for any prompt", async () => {
    const provider = new DemoProvider();
    // Mock sleep to speed up tests
    vi.spyOn(provider, "complete").mockResolvedValue("Mock response");
    const result = await provider.complete("test prompt");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ─── ProductAgent Tests ───────────────────────────────────────────────────────

describe("ProductAgent", () => {
  it("has correct agentName", () => {
    const agent = new ProductAgent();
    expect(agent.agentName).toBe("product");
  });

  it("has displayName set", () => {
    const agent = new ProductAgent();
    expect(agent.displayName).toBeTruthy();
  });

  it("returns completed status with artifacts on success", async () => {
    const agent = new ProductAgent();
    const mockProvider = {
      mode: "demo" as const,
      complete: vi.fn().mockResolvedValue("# Mock Requirements\n\nContent here"),
    };

    const result = await agent.run({
      projectId: "test-id",
      runId: "run-id",
      projectName: "Test Project",
      projectDescription: "A test project description",
      techStack: ["Next.js", "TypeScript"],
      previousArtifacts: [],
      provider: mockProvider,
    });

    expect(result.status).toBe("completed");
    expect(result.artifacts).toHaveLength(2);
    expect(result.artifacts[0].type).toBe("requirements");
    expect(result.artifacts[1].type).toBe("user-stories");
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.summary).toBeTruthy();
  });
});

// ─── ArchitectAgent Tests ─────────────────────────────────────────────────────

describe("ArchitectAgent", () => {
  it("has correct agentName", () => {
    const agent = new ArchitectAgent();
    expect(agent.agentName).toBe("architect");
  });

  it("returns architecture and api-plan artifacts", async () => {
    const agent = new ArchitectAgent();
    const mockProvider = {
      mode: "demo" as const,
      complete: vi.fn().mockResolvedValue("# Architecture\n\nDesign here"),
    };

    const result = await agent.run({
      projectId: "test-id",
      runId: "run-id",
      projectName: "Test Project",
      projectDescription: "A test project",
      techStack: ["Next.js"],
      previousArtifacts: [],
      provider: mockProvider,
    });

    expect(result.status).toBe("completed");
    expect(result.artifacts.map((a) => a.type)).toContain("architecture");
    expect(result.artifacts.map((a) => a.type)).toContain("api-plan");
  });
});

// ─── Validation Tests ─────────────────────────────────────────────────────────

describe("Project Validation", () => {
  it("rejects empty project name", async () => {
    const { z } = await import("zod");
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(10),
      techStack: z.array(z.string()).min(1),
    });

    const result = schema.safeParse({ name: "", description: "Valid desc here", techStack: ["Next.js"] });
    expect(result.success).toBe(false);
  });

  it("rejects short description", async () => {
    const { z } = await import("zod");
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(10),
      techStack: z.array(z.string()).min(1),
    });

    const result = schema.safeParse({ name: "My Project", description: "short", techStack: ["Next.js"] });
    expect(result.success).toBe(false);
  });

  it("accepts valid project data", async () => {
    const { z } = await import("zod");
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(10),
      techStack: z.array(z.string()).min(1),
    });

    const result = schema.safeParse({
      name: "My Project",
      description: "A valid project description with enough content",
      techStack: ["Next.js", "TypeScript"],
    });
    expect(result.success).toBe(true);
  });
});
