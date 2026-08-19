import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StartFactoryButton } from "./StartFactoryButton";
import * as db from "@/lib/db";
import { Calendar, Cpu, FileText, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = db.getProject(id);
  if (!project) notFound();

  const latestRun = db.getLatestRunForProject(id);
  const artifacts = latestRun ? db.getArtifactsForRun(latestRun.id) : [];

  const statusVariant: Record<string, "pending" | "info" | "success" | "error"> = {
    idle: "pending",
    running: "info",
    completed: "success",
    failed: "error",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Header
        title={project.name}
        description="Project details and factory control"
        action={
          <div className="flex gap-2">
            {latestRun && (
              <Link href={latestRun.status === "running" ? `/factory/${latestRun.id}` : `/results/${latestRun.id}`}>
                <Button size="sm" variant="secondary">
                  <FileText className="h-3.5 w-3.5" />
                  {latestRun.status === "running" ? "Watch Factory" : "View Results"}
                </Button>
              </Link>
            )}
            <StartFactoryButton projectId={project.id} />
          </div>
        }
      />

      {/* Status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[project.status]} dot>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            {latestRun && (
              <span className="text-xs text-zinc-600">
                Run mode: {latestRun.mode.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Calendar className="h-3 w-3" />
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>

        <h2 className="text-sm font-semibold text-zinc-300 mb-2">Description</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{project.description}</p>
      </div>

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Technology Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Latest Run */}
      {latestRun && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300">Latest Run</h2>
            <Link
              href={latestRun.status === "running" ? `/factory/${latestRun.id}` : `/results/${latestRun.id}`}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              {latestRun.status === "running" ? "Watch live" : "View results"}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-zinc-500 mb-1">Status</div>
              <Badge
                variant={
                  latestRun.status === "completed"
                    ? "success"
                    : latestRun.status === "running"
                    ? "info"
                    : "error"
                }
                dot
              >
                {latestRun.status}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">Artifacts</div>
              <div className="text-lg font-bold text-zinc-100">{artifacts.length}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">Mode</div>
              <div className="text-sm font-medium text-zinc-300 uppercase">{latestRun.mode}</div>
            </div>
          </div>
        </div>
      )}

      {/* Start CTA when idle */}
      {project.status === "idle" && (
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6 text-center">
          <Cpu className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-100 mb-2">Ready to start the factory?</h3>
          <p className="text-sm text-zinc-400 mb-5">
            Five AI agents will analyze your project and build a complete engineering blueprint.
          </p>
          <StartFactoryButton projectId={project.id} large />
        </div>
      )}
    </div>
  );
}
