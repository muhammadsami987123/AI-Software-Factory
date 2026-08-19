import { NextResponse } from "next/server";
import { z } from "zod";
import * as db from "@/lib/db";

const UpdateSettingsSchema = z.object({
  aiProvider: z.enum(["demo", "anthropic", "openai"]).optional(),
  anthropicApiKey: z.string().optional().nullable(),
  openaiApiKey: z.string().optional().nullable(),
  anthropicModel: z.string().optional(),
  openaiModel: z.string().optional(),
});

export async function GET() {
  try {
    const settings = db.getSettings();
    // Mask API keys in response
    return NextResponse.json({
      data: {
        ...settings,
        anthropicApiKey: settings.anthropicApiKey
          ? `sk-ant-...${settings.anthropicApiKey.slice(-4)}`
          : null,
        openaiApiKey: settings.openaiApiKey
          ? `sk-...${settings.openaiApiKey.slice(-4)}`
          : null,
      },
    });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = UpdateSettingsSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
    }

    const { aiProvider, anthropicApiKey, openaiApiKey, anthropicModel, openaiModel } =
      validated.data;

    if (aiProvider !== undefined) db.setSetting("ai_provider", aiProvider);
    if (anthropicApiKey !== undefined && anthropicApiKey !== null) {
      db.setSetting("anthropic_api_key", anthropicApiKey);
    }
    if (openaiApiKey !== undefined && openaiApiKey !== null) {
      db.setSetting("openai_api_key", openaiApiKey);
    }
    if (anthropicModel) db.setSetting("anthropic_model", anthropicModel);
    if (openaiModel) db.setSetting("openai_model", openaiModel);

    return NextResponse.json({ data: { success: true } });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
