import { PlusCircle, AlignLeft, Zap, Eye, Download } from "lucide-react";

const STEPS = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Create a Project",
    description:
      "Name your project, describe what you want to build, and select your preferred technology stack.",
  },
  {
    icon: AlignLeft,
    step: "02",
    title: "Describe Your Product",
    description:
      "Write a natural language description of your product vision. The more detail you provide, the richer the output.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Start AI Factory",
    description:
      "Launch the pipeline. Five specialized agents begin working through each phase of the development lifecycle.",
  },
  {
    icon: Eye,
    step: "04",
    title: "Watch Agents Work",
    description:
      "Monitor real-time progress as agents complete their tasks, create artifacts, and pass context to the next agent.",
  },
  {
    icon: Download,
    step: "05",
    title: "Review Results",
    description:
      "Explore all generated artifacts — requirements, architecture, implementation plans, tests, and reviews.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            From idea to blueprint in minutes
          </h2>
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            A simple, guided workflow that takes you from a product concept to a complete engineering blueprint.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[calc(10%+40px)] right-[calc(10%+40px)] h-px bg-zinc-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center lg:items-center">
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-100 text-sm mb-2">{title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
