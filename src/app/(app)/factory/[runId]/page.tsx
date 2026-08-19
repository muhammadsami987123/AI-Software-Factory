import { notFound } from "next/navigation";
import { FactoryWorkspace } from "@/components/factory/FactoryWorkspace";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FactoryPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = db.getRun(runId);
  if (!run) notFound();

  const project = db.getProject(run.projectId);
  if (!project) notFound();

  const tasks = db.getTasksForRun(runId);

  return (
    <div className="max-w-6xl mx-auto h-full">
      <FactoryWorkspace
        runId={runId}
        projectName={project.name}
        initialRun={run}
        initialTasks={tasks}
      />
    </div>
  );
}
