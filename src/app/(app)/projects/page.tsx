import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Plus, FolderOpen } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = db.listProjects();

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        title="Projects"
        description={`${projects.length} project${projects.length !== 1 ? "s" : ""} total`}
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
          <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-5">
            <FolderOpen className="h-6 w-6 text-zinc-500" />
          </div>
          <h3 className="text-base font-semibold text-zinc-300 mb-2">No projects yet</h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
            Create your first project and let the AI factory build your software blueprint.
          </p>
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {/* New project card */}
          <Link href="/projects/new" className="block group">
            <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-5 h-full min-h-[160px] flex flex-col items-center justify-center gap-2 transition-all duration-150">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                <Plus className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
              </div>
              <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">
                New Project
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
