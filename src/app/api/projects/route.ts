import { NextResponse } from "next/server";
import { z } from "zod";
import * as db from "@/lib/db";

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  techStack: z.array(z.string()).min(1, "Select at least one technology").max(10),
});

export async function GET() {
  try {
    const projects = db.listProjects();
    return NextResponse.json({ data: projects });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateProjectSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const project = db.createProject(validated.data);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
