"use client";

import { useState } from "react";
import type { Artifact, AgentTask } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Copy, Check } from "lucide-react";

const ARTIFACT_LABELS: Record<string, string> = {
  requirements: "Requirements",
  "user-stories": "User Stories",
  architecture: "Architecture",
  "db-schema": "DB Schema",
  "api-plan": "API Design",
  "component-plan": "Components",
  "tech-plan": "Tech Plan",
  "test-plan": "Test Plan",
  "edge-cases": "Edge Cases",
  "review-summary": "Code Review",
  recommendations: "Recommendations",
};

const AGENT_COLOR: Record<string, string> = {
  product: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  architect: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  developer: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  qa: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  reviewer: "text-rose-400 border-rose-500/30 bg-rose-500/10",
};

interface ArtifactViewerProps {
  artifacts: Artifact[];
  tasks: AgentTask[];
}

export function ArtifactViewer({ artifacts, tasks }: ArtifactViewerProps) {
  const [selected, setSelected] = useState<string | null>(
    artifacts[0]?.id ?? null
  );
  const [copied, setCopied] = useState(false);

  const selectedArtifact = artifacts.find((a) => a.id === selected);

  async function copyToClipboard(content: string) {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Group artifacts by agent
  const byAgent = artifacts.reduce<Record<string, Artifact[]>>((acc, a) => {
    if (!acc[a.agentName]) acc[a.agentName] = [];
    acc[a.agentName].push(a);
    return acc;
  }, {});

  const AGENT_ORDER = ["product", "architect", "developer", "qa", "reviewer"] as const;
  const AGENT_NAMES: Record<string, string> = {
    product: "Product Manager",
    architect: "Software Architect",
    developer: "Developer",
    qa: "QA Engineer",
    reviewer: "Code Reviewer",
  };

  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <span className="text-xl">📄</span>
        </div>
        <p className="text-sm font-medium text-zinc-400">No artifacts yet</p>
        <p className="text-xs text-zinc-600 mt-1">
          Artifacts appear here as agents complete their work
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 min-h-0">
      {/* Sidebar */}
      <div className="w-56 shrink-0 space-y-3">
        {AGENT_ORDER.map((agentName) => {
          const agentArtifacts = byAgent[agentName];
          const task = tasks.find((t) => t.agentName === agentName);
          if (!agentArtifacts || agentArtifacts.length === 0) return null;

          return (
            <div key={agentName}>
              <div className={cn("text-[10px] font-semibold px-2 py-1 rounded mb-1 border", AGENT_COLOR[agentName])}>
                {AGENT_NAMES[agentName]}
                {task?.durationMs && (
                  <span className="ml-1 opacity-60">· {(task.durationMs / 1000).toFixed(1)}s</span>
                )}
              </div>
              <div className="space-y-0.5">
                {agentArtifacts.map((artifact) => (
                  <button
                    key={artifact.id}
                    onClick={() => setSelected(artifact.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150",
                      selected === artifact.id
                        ? "bg-zinc-800 text-zinc-100 font-medium"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                    )}
                  >
                    {ARTIFACT_LABELS[artifact.type] ?? artifact.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
        {selectedArtifact ? (
          <>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 shrink-0">
              <div>
                <div className="text-xs text-zinc-500">
                  {AGENT_NAMES[selectedArtifact.agentName]}
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  {selectedArtifact.title}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(selectedArtifact.content)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="prose prose-sm prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-xs text-zinc-300 leading-relaxed font-mono bg-transparent p-0 border-0">
                  {selectedArtifact.content}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-zinc-600 text-sm">
            Select an artifact to view
          </div>
        )}
      </div>
    </div>
  );
}
