"use client";

import { useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import type { FactoryRun, AgentTask, ActivityEvent, Artifact, AgentName } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Circle, Loader2, XCircle, ArrowRight, Download } from "lucide-react";

// ─── State Machine ────────────────────────────────────────────────────────────

interface FactoryState {
  run: FactoryRun | null;
  tasks: AgentTask[];
  events: ActivityEvent[];
  artifacts: Artifact[];
  connected: boolean;
}

type FactoryAction =
  | { type: "SNAPSHOT"; run: FactoryRun; tasks: AgentTask[]; events: ActivityEvent[] }
  | { type: "EVENT"; event: ActivityEvent; tasks: AgentTask[]; run: FactoryRun | null }
  | { type: "CONNECTED" }
  | { type: "DISCONNECTED" };

function reducer(state: FactoryState, action: FactoryAction): FactoryState {
  switch (action.type) {
    case "SNAPSHOT":
      return {
        ...state,
        run: action.run,
        tasks: action.tasks,
        events: action.events,
        connected: true,
      };
    case "EVENT":
      return {
        ...state,
        run: action.run ?? state.run,
        tasks: action.tasks,
        events: [...state.events, action.event],
      };
    case "CONNECTED":
      return { ...state, connected: true };
    case "DISCONNECTED":
      return { ...state, connected: false };
    default:
      return state;
  }
}

const AGENT_ORDER: AgentName[] = ["product", "architect", "developer", "qa", "reviewer"];

const AGENT_META: Record<AgentName, { displayName: string; role: string }> = {
  product: { displayName: "Product Manager", role: "Requirements & Planning" },
  architect: { displayName: "Software Architect", role: "System Design" },
  developer: { displayName: "Developer", role: "Implementation" },
  qa: { displayName: "QA Engineer", role: "Quality Assurance" },
  reviewer: { displayName: "Code Reviewer", role: "Review & Audit" },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  runId: string;
  projectName: string;
  initialRun: FactoryRun;
  initialTasks: AgentTask[];
}

export function FactoryWorkspace({ runId, projectName, initialRun, initialTasks }: Props) {
  const router = useRouter();
  const logRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    run: initialRun,
    tasks: initialTasks,
    events: [],
    artifacts: [],
    connected: false,
  });

  // ── SSE Connection ──
  useEffect(() => {
    const es = new EventSource(`/api/runs/${runId}/stream`);

    es.onopen = () => dispatch({ type: "CONNECTED" });

    es.onmessage = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data as string);
        if (payload.type === "state_snapshot") {
          dispatch({
            type: "SNAPSHOT",
            run: payload.run,
            tasks: payload.tasks,
            events: payload.events ?? [],
          });
        } else if (payload.type === "event") {
          dispatch({
            type: "EVENT",
            event: payload.event,
            tasks: payload.tasks ?? state.tasks,
            run: payload.run ?? null,
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      dispatch({ type: "DISCONNECTED" });
      es.close();
    };

    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId]);

  // ── Auto-scroll log ──
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.events]);

  const isComplete = state.run?.status === "completed" || state.run?.status === "failed";
  const totalAgents = AGENT_ORDER.length;
  const completedAgents = state.tasks.filter((t) => t.status === "completed").length;
  const progress = totalAgents > 0 ? Math.round((completedAgents / totalAgents) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Factory Run</div>
              <h1 className="text-base font-semibold text-zinc-100">{projectName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {state.run && (
              <Badge
                variant={
                  state.run.status === "completed"
                    ? "success"
                    : state.run.status === "failed"
                    ? "error"
                    : "info"
                }
                dot
              >
                {state.run.status === "running"
                  ? "Running"
                  : state.run.status === "completed"
                  ? "Completed"
                  : "Failed"}
              </Badge>
            )}
            {isComplete && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => router.push(`/results/${runId}`)}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                View Results
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span>{completedAgents} of {totalAgents} agents complete</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content: pipeline + log */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1">
        {/* Pipeline */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Agent Pipeline
            </span>
            <span className="text-xs text-zinc-600 font-mono">
              MODE: {state.run?.mode?.toUpperCase() ?? "DEMO"}
            </span>
          </div>
          <div className="p-4 space-y-2">
            {AGENT_ORDER.map((agentName, i) => {
              const task = state.tasks.find((t) => t.agentName === agentName);
              const meta = AGENT_META[agentName];
              const status = task?.status ?? "pending";

              return (
                <div key={agentName}>
                  <AgentRow
                    displayName={meta.displayName}
                    role={meta.role}
                    status={status}
                    summary={task?.summary ?? null}
                    durationMs={task?.durationMs ?? null}
                  />
                  {i < AGENT_ORDER.length - 1 && (
                    <div className="flex justify-start pl-6 py-0.5">
                      <div
                        className={cn(
                          "w-px h-4",
                          status === "completed"
                            ? "bg-emerald-500/40"
                            : "bg-zinc-800"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion banner */}
          {isComplete && (
            <div
              className={cn(
                "mx-4 mb-4 rounded-lg px-4 py-3 flex items-center gap-3",
                state.run?.status === "completed"
                  ? "bg-emerald-500/10 border border-emerald-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              )}
            >
              {state.run?.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 shrink-0" />
              )}
              <div>
                <div className={cn(
                  "text-sm font-medium",
                  state.run?.status === "completed" ? "text-emerald-300" : "text-red-300"
                )}>
                  {state.run?.status === "completed"
                    ? "Factory run completed successfully"
                    : "Factory run completed with errors"}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {completedAgents}/{totalAgents} agents completed
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="ml-auto"
                onClick={() => router.push(`/results/${runId}`)}
              >
                <Download className="h-3.5 w-3.5" />
                Results
              </Button>
            </div>
          )}
        </div>

        {/* Live Log */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Live Log
            </span>
            {state.connected && !isComplete && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs text-blue-400">Live</span>
              </div>
            )}
          </div>
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-0 font-mono text-xs"
          >
            {state.events.length === 0 ? (
              <div className="text-zinc-600 text-center py-8">Waiting for events...</div>
            ) : (
              state.events.map((event) => (
                <LogEntry key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AgentRowProps {
  displayName: string;
  role: string;
  status: AgentTask["status"];
  summary: string | null;
  durationMs: number | null;
}

function AgentRow({ displayName, role, status, summary, durationMs }: AgentRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border transition-all duration-300",
        status === "running"
          ? "border-blue-500/30 bg-blue-500/5"
          : status === "completed"
          ? "border-emerald-500/20 bg-emerald-500/5"
          : status === "failed"
          ? "border-red-500/20 bg-red-500/5"
          : "border-zinc-800 bg-transparent"
      )}
    >
      {/* Status icon */}
      <div className="pt-0.5 shrink-0">
        {status === "completed" && (
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
        )}
        {status === "running" && (
          <Loader2 className="h-4.5 w-4.5 text-blue-400 animate-spin" />
        )}
        {status === "failed" && (
          <XCircle className="h-4.5 w-4.5 text-red-400" />
        )}
        {status === "pending" && (
          <Circle className="h-4.5 w-4.5 text-zinc-700" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              status === "pending" ? "text-zinc-500" : "text-zinc-100"
            )}
          >
            {displayName}
          </span>
          {durationMs !== null && (
            <span className="text-xs font-mono text-zinc-500 shrink-0">
              {(durationMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5">{role}</div>
        {summary && (
          <div
            className={cn(
              "text-xs mt-1.5 truncate",
              status === "completed" ? "text-emerald-400/70" : "text-blue-400/70"
            )}
          >
            {summary}
          </div>
        )}
        {status === "running" && !summary && (
          <div className="text-xs mt-1.5 text-blue-400/70 animate-pulse">
            Working...
          </div>
        )}
      </div>
    </div>
  );
}

function LogEntry({ event }: { event: ActivityEvent }) {
  const time = new Date(event.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const color =
    event.eventType === "agent_completed" || event.eventType === "run_completed"
      ? "text-emerald-400"
      : event.eventType === "agent_failed" || event.eventType === "run_failed"
      ? "text-red-400"
      : event.eventType === "agent_started" || event.eventType === "run_started"
      ? "text-blue-400"
      : event.eventType === "artifact_created"
      ? "text-violet-400"
      : "text-zinc-400";

  return (
    <div className="flex gap-2 animate-fade-in">
      <span className="text-zinc-600 shrink-0 tabular-nums">{time}</span>
      <span className={cn("leading-relaxed", color)}>{event.message}</span>
    </div>
  );
}
