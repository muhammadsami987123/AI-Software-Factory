import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET() {
  try {
    const stats = db.getDashboardStats();
    const projects = db.listProjects().slice(0, 5);
    const recentEvents = db.getRecentEvents(20);
    return NextResponse.json({ data: { stats, recentProjects: projects, recentEvents } });
  } catch (err) {
    console.error("GET /api/dashboard error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
