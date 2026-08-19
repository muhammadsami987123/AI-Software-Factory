import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Activity } from "lucide-react";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

const EVENT_CONFIG: Record<
  string,
  { variant: "success" | "error" | "info" | "pending" | "default"; label: string }
> = {
  run_started: { variant: "info", label: "Run Started" },
  agent_started: { variant: "info", label: "Agent Started" },
  agent_progress: { variant: "pending", label: "Progress" },
  agent_completed: { variant: "success", label: "Completed" },
  agent_failed: { variant: "error", label: "Failed" },
  artifact_created: { variant: "default", label: "Artifact" },
  run_completed: { variant: "success", label: "Run Done" },
  run_failed: { variant: "error", label: "Run Failed" },
};

export default function ActivityPage() {
  const events = db.getRecentEvents(200);

  return (
    <div className="max-w-3xl mx-auto">
      <Header
        title="Activity"
        description={`${events.length} recent events`}
      />

      {events.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <Activity className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-zinc-300 mb-2">No activity yet</h3>
          <p className="text-sm text-zinc-500">
            Activity events appear here when you run the factory.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-800">
            <div className="grid grid-cols-[1fr,auto,auto,2fr] gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <span>Time</span>
              <span>Type</span>
              <span>Agent</span>
              <span>Message</span>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {events.map((event) => {
              const config = EVENT_CONFIG[event.eventType] ?? { variant: "default", label: event.eventType };
              const AGENT_NAMES: Record<string, string> = {
                product: "Product",
                architect: "Architect",
                developer: "Developer",
                qa: "QA",
                reviewer: "Reviewer",
              };
              return (
                <div
                  key={event.id}
                  className="grid grid-cols-[1fr,auto,auto,2fr] gap-4 items-center px-5 py-3 text-xs hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="text-zinc-600 font-mono tabular-nums">
                    {new Date(event.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </span>
                  <Badge variant={config.variant} size="sm">
                    {config.label}
                  </Badge>
                  <span className="text-zinc-500 text-[11px] font-medium">
                    {event.agentName ? AGENT_NAMES[event.agentName] ?? event.agentName : "—"}
                  </span>
                  <span className="text-zinc-300 truncate">{event.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
