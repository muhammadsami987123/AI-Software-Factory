import Link from "next/link";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Calendar, ChevronRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusVariant: Record<Project["status"], "pending" | "info" | "success" | "error"> = {
    idle: "pending",
    running: "info",
    completed: "success",
    failed: "error",
  };

  const statusLabel: Record<Project["status"], string> = {
    idle: "Idle",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
  };

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all duration-150">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors">
            {project.name}
          </h3>
          <Badge variant={statusVariant[project.status]} dot size="sm">
            {statusLabel[project.status]}
          </Badge>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-500">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1 text-zinc-500 group-hover:text-blue-400 transition-colors">
            {project.status === "idle" ? (
              <>
                <Cpu className="h-3 w-3" />
                <span>Start Factory</span>
              </>
            ) : (
              <>
                <span>View</span>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
