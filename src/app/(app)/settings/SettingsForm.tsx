"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Shield, Zap } from "lucide-react";
import type { AIMode, Settings } from "@/types";

interface Props {
  initialSettings: Omit<Settings, "anthropicApiKey" | "openaiApiKey"> & {
    anthropicApiKey: string;
    openaiApiKey: string;
  };
  currentProvider: AIMode;
}

const PROVIDERS: { id: AIMode; label: string; description: string }[] = [
  {
    id: "demo",
    label: "Demo Mode",
    description: "No API key required. Simulates realistic agent execution.",
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    description: "Use Claude Sonnet or Opus for real AI execution.",
  },
  {
    id: "openai",
    label: "OpenAI (GPT-4)",
    description: "Use GPT-4o or GPT-4-turbo for real AI execution.",
  },
];

export function SettingsForm({ initialSettings, currentProvider }: Props) {
  const [provider, setProvider] = useState<AIMode>(currentProvider);
  const [anthropicKey, setAnthropicKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicModel, setAnthropicModel] = useState(initialSettings.anthropicModel);
  const [openaiModel, setOpenaiModel] = useState(initialSettings.openaiModel);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, string> = {
        aiProvider: provider,
        anthropicModel,
        openaiModel,
      };
      if (anthropicKey && !anthropicKey.includes("...")) {
        body.anthropicApiKey = anthropicKey;
      }
      if (openaiKey && !openaiKey.includes("...")) {
        body.openaiApiKey = openaiKey;
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError("Failed to save settings");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* AI Provider */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">AI Provider</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select which AI provider powers the factory agents.
          </p>
        </div>
        <div className="p-5 space-y-3">
          {PROVIDERS.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => setProvider(id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all duration-150",
                provider === id
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-zinc-100">{label}</span>
                {provider === id && (
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                )}
                {id === "demo" && (
                  <Badge variant="success" size="sm">No API Key</Badge>
                )}
              </div>
              <div className="text-xs text-zinc-500">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Shield className="h-4 w-4 text-zinc-500" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">API Keys</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Keys are stored locally and never exposed in the UI.
            </p>
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className={cn("space-y-4", provider !== "anthropic" && "opacity-50")}>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Anthropic
            </div>
            <Input
              label="API Key"
              type="password"
              placeholder={initialSettings.anthropicApiKey || "sk-ant-..."}
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              disabled={provider !== "anthropic"}
              hint="Your Anthropic API key. Leave blank to keep the existing key."
            />
            <Input
              label="Model"
              placeholder="claude-sonnet-4-6"
              value={anthropicModel}
              onChange={(e) => setAnthropicModel(e.target.value)}
              disabled={provider !== "anthropic"}
            />
          </div>

          <div className={cn("space-y-4 pt-4 border-t border-zinc-800", provider !== "openai" && "opacity-50")}>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              OpenAI
            </div>
            <Input
              label="API Key"
              type="password"
              placeholder={initialSettings.openaiApiKey || "sk-..."}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              disabled={provider !== "openai"}
              hint="Your OpenAI API key. Leave blank to keep the existing key."
            />
            <Input
              label="Model"
              placeholder="gpt-4o"
              value={openaiModel}
              onChange={(e) => setOpenaiModel(e.target.value)}
              disabled={provider !== "openai"}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between">
        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Settings saved
          </div>
        )}
        {!error && !saved && <div />}
        <Button onClick={handleSave} loading={saving}>
          <Zap className="h-3.5 w-3.5" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
