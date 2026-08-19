import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "100");
    const events = db.getRecentEvents(Math.min(limit, 500));
    return NextResponse.json({ data: events });
  } catch (err) {
    console.error("GET /api/activity error:", err);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
