import { FolderOpen, CheckCircle2, Cpu, TrendingUp } from "lucide-react";

interface StatsGridProps {
  activeProjects: number;
  completedProjects: number;
  totalRuns: number;
  successRate: number;
}

export function StatsGrid({ activeProjects, completedProjects, totalRuns, successRate }: StatsGridProps) {
  const stats = [
    {
      label: "Active Projects",
      value: activeProjects,
      icon: FolderOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Runs",
      value: totalRuns,
      icon: Cpu,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
        >
          <div className={`inline-flex items-center justify-center h-9 w-9 rounded-lg ${bg} border ${border} mb-3`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{value}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
