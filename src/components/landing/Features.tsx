import { Cpu, Bot, Zap, FileText, Shield, LayoutDashboard } from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "Multi-Agent Pipeline",
    description:
      "Five specialized agents — Product Manager, Architect, Developer, QA, Reviewer — collaborate sequentially, each building on the previous agent's work.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Real-Time Execution",
    description:
      "Watch agents work through the pipeline live. Server-Sent Events stream every status change, artifact creation, and progress update to your browser instantly.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: FileText,
    title: "Structured Artifacts",
    description:
      "Each agent produces professional, formatted documents — requirements, architecture specs, API designs, test plans, and code reviews ready to use.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: LayoutDashboard,
    title: "Demo Mode Ready",
    description:
      "No API key required. Demo Mode simulates realistic agent execution with proper timing, rich artifacts, and live progress updates out of the box.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Cpu,
    title: "Provider Agnostic",
    description:
      "Plug in Anthropic Claude or OpenAI GPT-4 with a single settings change. The provider abstraction keeps your data independent of any AI vendor.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: Shield,
    title: "Professional Output",
    description:
      "Artifacts are formatted for real engineering teams — not toy outputs. Requirements documents, architecture diagrams, and test suites you can actually use.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Everything you need to ship faster
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            From initial idea to complete engineering blueprint — the full development lifecycle, automated.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg, border }) => (
            <div
              key={title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors duration-150"
            >
              <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${bg} border ${border} mb-4`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} />
              </div>
              <h3 className="font-semibold text-zinc-100 text-sm mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
