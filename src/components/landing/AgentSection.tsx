const AGENTS = [
  {
    emoji: "📋",
    name: "Product Manager",
    role: "Requirements & Planning",
    color: "border-blue-500/30 bg-blue-500/5",
    accent: "text-blue-400",
    outputs: ["Requirements Document", "User Stories", "Feature Breakdown"],
  },
  {
    emoji: "🏗️",
    name: "Software Architect",
    role: "System Design",
    color: "border-violet-500/30 bg-violet-500/5",
    accent: "text-violet-400",
    outputs: ["Architecture Diagram", "Database Schema", "API Design"],
  },
  {
    emoji: "⚙️",
    name: "Developer",
    role: "Implementation",
    color: "border-amber-500/30 bg-amber-500/5",
    accent: "text-amber-400",
    outputs: ["Component Plan", "Tech Strategy", "Code Patterns"],
  },
  {
    emoji: "🧪",
    name: "QA Engineer",
    role: "Quality Assurance",
    color: "border-emerald-500/30 bg-emerald-500/5",
    accent: "text-emerald-400",
    outputs: ["Test Plan", "Edge Cases", "Quality Criteria"],
  },
  {
    emoji: "👁️",
    name: "Code Reviewer",
    role: "Review & Audit",
    color: "border-rose-500/30 bg-rose-500/5",
    accent: "text-rose-400",
    outputs: ["Code Review", "Security Audit", "Recommendations"],
  },
];

export function AgentSection() {
  return (
    <section id="agents" className="py-20 sm:py-28 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            The Agents
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Five specialists, one pipeline
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            Each agent has a focused responsibility and passes its work to the next, creating a cumulative engineering blueprint.
          </p>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS.map(({ emoji, name, role, color, accent, outputs }) => (
            <div
              key={name}
              className={`border rounded-xl p-4 ${color} transition-all duration-150`}
            >
              <div className="text-2xl mb-3">{emoji}</div>
              <div className={`text-xs font-semibold ${accent} mb-1`}>{role}</div>
              <div className="text-sm font-semibold text-zinc-100 mb-3">{name}</div>
              <div className="space-y-1.5">
                {outputs.map((output) => (
                  <div key={output} className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <div className={`h-1 w-1 rounded-full ${accent.replace("text-", "bg-")}`} />
                    {output}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline flow indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          {AGENTS.map((agent, i) => (
            <div key={agent.name} className="flex items-center gap-2">
              <span className={`text-xs font-medium ${agent.accent}`}>
                {agent.name.split(" ")[0]}
              </span>
              {i < AGENTS.length - 1 && (
                <svg className="h-3 w-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
