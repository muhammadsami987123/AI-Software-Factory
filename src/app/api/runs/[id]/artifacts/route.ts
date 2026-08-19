import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: runId } = await params;
    const run = db.getRun(runId);
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }
    const artifacts = db.getArtifactsForRun(runId);
    const tasks = db.getTasksForRun(runId);
    const events = db.getEventsForRun(runId);
    return NextResponse.json({ data: { run, artifacts, tasks, events } });
  } catch (err) {
    console.error("GET /api/runs/[id]/artifacts error:", err);
    return NextResponse.json({ error: "Failed to fetch artifacts" }, { status: 500 });
  }
}
