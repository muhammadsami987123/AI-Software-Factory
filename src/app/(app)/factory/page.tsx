import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Cpu, ArrowRight } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function FactoryIndexPage() {
  const projects = db.listProjects();
  const runningProjects = projects.filter((p) => p.status === "running");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="max-w-3xl mx-auto">
      <Header
        title="Factory"
        description="Manage and monitor your AI factory runs"
        action={
          <Link href="/projects/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <Cpu className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-zinc-300 mb-2">No factory runs yet</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Create a project to start your first factory run
          </p>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {runningProjects.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Active
              </div>
              {runningProjects.map((project) => {
                const run = db.getLatestRunForProject(project.id);
                return (
                  <Link key={project.id} href={run ? `/factory/${run.id}` : `/projects/${project.id}`}>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-2 flex items-center justify-between hover:bg-blue-500/10 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info" dot>Running</Badge>
                          <span className="text-xs text-zinc-500 uppercase font-mono">{run?.mode}</span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {completedProjects.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Completed
              </div>
              {completedProjects.map((project) => {
                const run = db.getLatestRunForProject(project.id);
                return (
                  <Link key={project.id} href={run ? `/results/${run.id}` : `/projects/${project.id}`}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-2 flex items-center justify-between hover:border-zinc-700 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="success" dot>Completed</Badge>
                        </div>
                        <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {projects.filter((p) => p.status === "idle").length > 0 && (
            <div>
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Ready to run
              </div>
              {projects.filter((p) => p.status === "idle").map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-2 flex items-center justify-between hover:border-zinc-700 transition-colors">
                    <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Cpu className="h-3.5 w-3.5" />
                      Start Factory
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
