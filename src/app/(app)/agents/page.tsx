import { Header } from "@/components/layout/Header";

const AGENTS = [
  {
    emoji: "📋",
    name: "Product Manager",
    agentName: "product",
    role: "Requirements & Planning",
    description:
      "Analyzes product requirements and transforms them into structured engineering documents. Generates user stories with acceptance criteria, prioritized feature breakdowns, and sprint estimates.",
    outputs: ["Requirements Document", "User Stories", "Feature Breakdown", "Sprint Plan"],
    color: "border-blue-500/30 bg-blue-500/5",
    accent: "text-blue-400",
  },
  {
    emoji: "🏗️",
    name: "Software Architect",
    agentName: "architect",
    role: "System Design",
    description:
      "Designs the complete technical foundation — system architecture with component diagrams, database schema with SQL definitions, and a comprehensive API structure with endpoint documentation.",
    outputs: ["System Architecture", "Database Schema", "API Design", "Security Plan"],
    color: "border-violet-500/30 bg-violet-500/5",
    accent: "text-violet-400",
  },
  {
    emoji: "⚙️",
    name: "Developer",
    agentName: "developer",
    role: "Implementation",
    description:
      "Plans the implementation strategy with component architecture, custom hooks, state management patterns, and a phased development roadmap. Bridges design and working code.",
    outputs: ["Component Plan", "Code Patterns", "Tech Strategy", "Dev Roadmap"],
    color: "border-amber-500/30 bg-amber-500/5",
    accent: "text-amber-400",
  },
  {
    emoji: "🧪",
    name: "QA Engineer",
    agentName: "qa",
    role: "Quality Assurance",
    description:
      "Creates comprehensive test plans following the Testing Trophy pattern. Defines unit tests, integration tests, and E2E scenarios with real code examples. Identifies edge cases systematically.",
    outputs: ["Test Plan", "Unit Tests", "E2E Scenarios", "Edge Cases"],
    color: "border-emerald-500/30 bg-emerald-500/5",
    accent: "text-emerald-400",
  },
  {
    emoji: "👁️",
    name: "Code Reviewer",
    agentName: "reviewer",
    role: "Review & Audit",
    description:
      "Reviews all artifacts for quality, security, and maintainability. Produces a scored audit with before/after code examples, a security checklist, performance recommendations, and a final confidence rating.",
    outputs: ["Code Review", "Security Audit", "Performance Tips", "Recommendations"],
    color: "border-rose-500/30 bg-rose-500/5",
    accent: "text-rose-400",
  },
];

export default function AgentsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Agents"
        description="Five specialized AI agents — each with a focused role in the development pipeline"
      />

      {/* Pipeline flow */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
        <div className="text-xs text-zinc-500 mb-3 font-semibold uppercase tracking-wider">
          Pipeline Order
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {AGENTS.map((agent, i) => (
            <div key={agent.name} className="flex items-center gap-1">
              <span className={`text-xs font-medium ${agent.accent}`}>
                {agent.name}
              </span>
              {i < AGENTS.length - 1 && (
                <svg className="h-3 w-3 text-zinc-700 mx-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.name}
            className={`border rounded-xl p-5 ${agent.color}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">{agent.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-semibold text-zinc-100 text-base">{agent.name}</h3>
                  <span className={`text-xs font-medium ${agent.accent}`}>{agent.role}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{agent.description}</p>
                <div>
                  <div className="text-xs font-semibold text-zinc-500 mb-2">Output Artifacts</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.outputs.map((output) => (
                      <span
                        key={output}
                        className="text-xs px-2.5 py-1 rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-400 font-medium"
                      >
                        {output}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
