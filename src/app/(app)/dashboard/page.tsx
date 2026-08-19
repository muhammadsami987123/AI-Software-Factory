import Link from "next/link";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { Plus, Zap } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = db.getDashboardStats();
  const recentProjects = db.listProjects().slice(0, 4);
  const recentEvents = db.getRecentEvents(15);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Header
        title="Overview"
        description="Your AI Software Factory dashboard"
        action={
          <Link href="/projects/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </Link>
        }
      />

      <StatsGrid
        activeProjects={stats.activeProjects}
        completedProjects={stats.completedProjects}
        totalRuns={stats.totalRuns}
        successRate={stats.successRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Projects</h2>
            <Link href="/projects" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              View all
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-5 w-5 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-400 mb-1">No projects yet</p>
              <p className="text-xs text-zinc-600 mb-5">
                Create your first project to start the AI factory
              </p>
              <Link href="/projects/new">
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Activity */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Activity</h2>
          </div>
          <RecentActivity events={recentEvents} />
        </div>
      </div>

      {/* Agent Status */}
      <div>
        <div className="text-sm font-semibold text-zinc-200 mb-4">Agent Pipeline</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "Product Manager", emoji: "📋", role: "Requirements" },
            { name: "Architect", emoji: "🏗️", role: "System Design" },
            { name: "Developer", emoji: "⚙️", role: "Implementation" },
            { name: "QA Engineer", emoji: "🧪", role: "Quality" },
            { name: "Reviewer", emoji: "👁️", role: "Review" },
          ].map(({ name, emoji, role }) => (
            <div
              key={name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center text-center"
            >
              <div className="text-xl mb-2">{emoji}</div>
              <div className="text-xs font-semibold text-zinc-300">{name}</div>
              <div className="text-[10px] text-zinc-600 mt-0.5">{role}</div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-zinc-600">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                Standby
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
