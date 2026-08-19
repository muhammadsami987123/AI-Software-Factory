"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";

interface Props {
  projectId: string;
  large?: boolean;
}

export function StartFactoryButton({ projectId, large }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "demo" }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to start factory");
        return;
      }
      const data = await res.json() as { data: { id: string } };
      router.push(`/factory/${data.data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={start}
        loading={loading}
        size={large ? "lg" : "sm"}
      >
        <Zap className={large ? "h-4 w-4" : "h-3.5 w-3.5"} />
        {loading ? "Starting..." : "Start AI Factory"}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
