import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Multi-Agent AI Platform — Demo Mode Available
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-50 leading-tight tracking-tight max-w-4xl">
            Turn Product Ideas Into{" "}
            <span className="text-blue-400">Software</span>{" "}
            With AI Agents
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Five specialized agents collaborate through every phase of the development lifecycle —
            from requirements to architecture, code to review — in minutes, not months.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-150 shadow-lg shadow-blue-600/20 text-sm"
            >
              <Zap className="h-4 w-4" />
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-xl transition-all duration-150 text-sm"
            >
              Explore Factory
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 pt-8 border-t border-zinc-800 w-full max-w-xl">
            {[
              { label: "AI Agents", value: "5" },
              { label: "Pipeline Stages", value: "7" },
              { label: "Artifact Types", value: "10+" },
              { label: "Demo Mode", value: "Free" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-zinc-100">{value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div className="mt-16 relative">
          <div className="absolute -inset-4 bg-gradient-to-t from-zinc-950 to-transparent z-10 top-auto bottom-0 h-24" />
          <FactoryPreview />
        </div>
      </div>
    </section>
  );
}

function FactoryPreview() {
  const stages = [
    { name: "Product Manager", status: "completed", time: "6.2s", summary: "Requirements & user stories generated" },
    { name: "Software Architect", status: "completed", time: "8.1s", summary: "Architecture & API design completed" },
    { name: "Developer", status: "running", time: "—", summary: "Generating implementation plan..." },
    { name: "QA Engineer", status: "pending", time: "—", summary: "Waiting" },
    { name: "Code Reviewer", status: "pending", time: "—", summary: "Waiting" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs font-mono text-zinc-500 ml-2">AI Software Factory — Running</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs text-blue-400 font-medium">Live</span>
        </div>
      </div>

      {/* Pipeline */}
      <div className="p-6 space-y-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Pipeline — AI Customer Support Platform
        </div>
        {stages.map((stage, i) => (
          <div key={stage.name}>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                stage.status === "running"
                  ? "border-blue-500/30 bg-blue-500/5"
                  : stage.status === "completed"
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-zinc-800 bg-transparent"
              }`}
            >
              <StatusDot status={stage.status as "completed" | "running" | "pending"} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    stage.status === "pending" ? "text-zinc-500" : "text-zinc-200"
                  }`}>
                    {stage.name}
                  </span>
                  {stage.status === "running" && (
                    <span className="text-xs text-blue-400 animate-pulse">Working...</span>
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 truncate">{stage.summary}</div>
              </div>
              {stage.status === "completed" && (
                <span className="text-xs text-zinc-500 font-mono shrink-0">{stage.time}</span>
              )}
            </div>
            {i < stages.length - 1 && (
              <div className="flex justify-center py-0.5">
                <div className={`w-px h-3 ${
                  stage.status === "completed" ? "bg-emerald-500/30" : "bg-zinc-800"
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log strip */}
      <div className="border-t border-zinc-800 bg-zinc-950/40 px-6 py-3">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span className="text-emerald-400">✓</span> Product Manager completed in 6.2s
          <span className="mx-2 text-zinc-700">·</span>
          <span className="text-emerald-400">✓</span> Architect completed in 8.1s
          <span className="mx-2 text-zinc-700">·</span>
          <span className="text-blue-400 animate-pulse">●</span> Developer running...
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: "completed" | "running" | "pending" }) {
  if (status === "completed") {
    return (
      <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
        <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === "running") {
    return (
      <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
        <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping" />
      </div>
    );
  }
  return (
    <div className="h-5 w-5 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
    </div>
  );
}
