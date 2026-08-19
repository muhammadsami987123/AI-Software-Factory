import { NextResponse } from "next/server";
import type { AgentDisplayInfo } from "@/types";

const AGENTS: AgentDisplayInfo[] = [
  {
    name: "product",
    displayName: "Product Manager",
    role: "Requirements & Planning",
    description:
      "Analyzes product requirements, generates comprehensive user stories, and creates a prioritized feature breakdown. Transforms vague ideas into structured engineering requirements.",
    responsibilities: ["Requirements analysis", "User story generation", "Feature prioritization", "Sprint planning"],
  },
  {
    name: "architect",
    displayName: "Software Architect",
    role: "System Design",
    description:
      "Designs the complete system architecture including database schema, API structure, and deployment topology. Ensures scalability, security, and maintainability from day one.",
    responsibilities: ["System architecture", "Database design", "API planning", "Security architecture"],
  },
  {
    name: "developer",
    displayName: "Developer",
    role: "Implementation",
    description:
      "Plans the component architecture, defines implementation patterns, and creates a detailed technical roadmap. Bridges the gap between design and working code.",
    responsibilities: ["Component planning", "Implementation strategy", "Code patterns", "Tech decisions"],
  },
  {
    name: "qa",
    displayName: "QA Engineer",
    role: "Quality Assurance",
    description:
      "Creates comprehensive test plans covering unit, integration, and E2E scenarios. Identifies edge cases and defines acceptance criteria to ensure product quality.",
    responsibilities: ["Test planning", "Edge case analysis", "Quality criteria", "Performance testing"],
  },
  {
    name: "reviewer",
    displayName: "Code Reviewer",
    role: "Review & Audit",
    description:
      "Reviews all produced artifacts for code quality, security vulnerabilities, and maintainability. Provides prioritized recommendations and a final project confidence score.",
    responsibilities: ["Code quality review", "Security audit", "Performance review", "Final recommendations"],
  },
];

export async function GET() {
  try {
    return NextResponse.json({ data: AGENTS });
  } catch (err) {
    console.error("GET /api/agents error:", err);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}
