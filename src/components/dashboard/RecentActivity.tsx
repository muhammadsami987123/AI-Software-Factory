import type { ActivityEvent } from "@/types";
import { cn } from "@/lib/utils/cn";

interface RecentActivityProps {
  events: ActivityEvent[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  if (events.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">Recent Activity</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
            <span className="text-lg">📋</span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">No activity yet</p>
          <p className="text-xs text-zinc-600 mt-1">Create a project and start your first factory run</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-200">Recent Activity</h2>
      </div>
      <div className="divide-y divide-zinc-800/60">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 px-5 py-3">
            <EventDot eventType={event.eventType} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 leading-relaxed truncate">{event.message}</p>
              <p className="text-xs text-zinc-600 mt-0.5">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventDot({ eventType }: { eventType: ActivityEvent["eventType"] }) {
  const color =
    eventType === "agent_completed" || eventType === "run_completed"
      ? "bg-emerald-400"
      : eventType === "agent_failed" || eventType === "run_failed"
      ? "bg-red-400"
      : eventType === "run_started" || eventType === "agent_started"
      ? "bg-blue-400"
      : eventType === "artifact_created"
      ? "bg-violet-400"
      : "bg-zinc-500";

  return (
    <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0", color)} />
  );
}
