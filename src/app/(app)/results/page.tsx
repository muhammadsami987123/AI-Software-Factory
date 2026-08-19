import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { FileText, ArrowRight } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ResultsIndexPage() {
  const projects = db.listProjects();
  const completedProjects = projects.filter(
    (p) => p.status === "completed" || p.status === "failed"
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Header
        title="Results"
        description={`${completedProjects.length} completed run${completedProjects.length !== 1 ? "s" : ""}`}
      />

      {completedProjects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <FileText className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-zinc-300 mb-2">No results yet</h3>
          <p className="text-sm text-zinc-500">
            Complete a factory run to see your generated artifacts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedProjects.map((project) => {
            const run = db.getLatestRunForProject(project.id);
            const artifacts = run ? db.getArtifactsForRun(run.id) : [];
            return (
              <Link key={project.id} href={run ? `/results/${run.id}` : `/projects/${project.id}`}>
                <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex items-center justify-between transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={project.status === "completed" ? "success" : "error"} dot>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-zinc-600 font-mono">{run?.mode?.toUpperCase()}</span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-100">{project.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {artifacts.length} artifacts · {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
