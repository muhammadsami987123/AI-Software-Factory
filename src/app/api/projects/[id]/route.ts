import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db.getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const latestRun = db.getLatestRunForProject(id);
    return NextResponse.json({ data: { project, latestRun } });
  } catch (err) {
    console.error("GET /api/projects/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
