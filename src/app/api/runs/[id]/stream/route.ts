import * as db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: runId } = await params;

  const encoder = new TextEncoder();
  let lastRowId = 0;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state snapshot
      const sendSnapshot = () => {
        try {
          const run = db.getRun(runId);
          if (!run) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", message: "Run not found" })}\n\n`
              )
            );
            controller.close();
            closed = true;
            return;
          }
          const tasks = db.getTasksForRun(runId);
          const events = db.getEventsForRun(runId);
          lastRowId = db.getLastEventRowId(runId);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "state_snapshot", run, tasks, events })}\n\n`
            )
          );

          // If already complete, close after snapshot
          if (run.status !== "running") {
            controller.close();
            closed = true;
          }
        } catch (err) {
          console.error("SSE snapshot error:", err);
        }
      };

      sendSnapshot();
      if (closed) return;

      // Poll for new events every 600ms
      const interval = setInterval(() => {
        if (closed) {
          clearInterval(interval);
          return;
        }
        try {
          const newEvents = db.getEventsForRun(runId, lastRowId);
          if (newEvents.length > 0) {
            lastRowId = db.getLastEventRowId(runId);
            const tasks = db.getTasksForRun(runId);
            const run = db.getRun(runId);

            for (const event of newEvents) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "event", event, tasks, run })}\n\n`
                )
              );
            }

            // Check if run is complete
            if (run && run.status !== "running") {
              clearInterval(interval);
              setTimeout(() => {
                if (!closed) {
                  controller.close();
                  closed = true;
                }
              }, 1000);
            }
          }
        } catch (err) {
          console.error("SSE poll error:", err);
        }
      }, 600);

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // already closed
          }
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
