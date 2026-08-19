import { NextResponse } from "next/server";
import { z } from "zod";
import * as db from "@/lib/db";
import { executeRun } from "@/lib/agents/orchestrator";
import type { AIMode } from "@/types";

const StartRunSchema = z.object({
  mode: z.enum(["demo", "anthropic", "openai"]).optional().default("demo"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db.getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const validated = StartRunSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Determine mode from request or settings
    const settings = db.getSettings();
    const mode: AIMode = validated.data.mode ?? settings.aiProvider;

    // Create the run
    const run = db.createRun(id, mode);

    // Execute asynchronously — don't await
    setImmediate(() => {
      executeRun(run.id).catch((err) => {
        console.error(`Run ${run.id} failed:`, err);
        try {
          db.updateRunStatus(run.id, "failed");
          db.updateProjectStatus(id, "failed");
          db.createEvent({
            runId: run.id,
            eventType: "run_failed",
            message: `Fatal error: ${err instanceof Error ? err.message : "Unknown error"}`,
          });
        } catch {
          // ignore secondary errors
        }
      });
    });

    return NextResponse.json({ data: run }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects/[id]/run error:", err);
    return NextResponse.json({ error: "Failed to start factory run" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const run = db.getLatestRunForProject(id);
    if (!run) {
      return NextResponse.json({ data: null });
    }
    const tasks = db.getTasksForRun(run.id);
    return NextResponse.json({ data: { run, tasks } });
  } catch (err) {
    console.error("GET /api/projects/[id]/run error:", err);
    return NextResponse.json({ error: "Failed to fetch run" }, { status: 500 });
  }
}
