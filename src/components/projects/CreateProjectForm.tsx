"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { Zap, CheckCircle2 } from "lucide-react";

const TECH_OPTIONS = [
  "Next.js", "React", "Vue.js", "Angular", "Svelte",
  "Node.js", "FastAPI", "Django", "Rails", "Go",
  "PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis",
  "TypeScript", "Python", "Rust", "Java", "PHP",
  "Tailwind CSS", "GraphQL", "Docker", "Kubernetes", "AWS",
];

const EXAMPLE_PROJECTS = [
  {
    name: "AI Customer Support Platform",
    description:
      "Build a SaaS customer support platform where businesses can manage customer conversations with AI-generated replies, support tickets, priority routing, and analytics dashboards.",
  },
  {
    name: "E-Commerce Analytics Dashboard",
    description:
      "A real-time analytics platform for e-commerce businesses to track sales performance, customer behavior, inventory levels, and marketing campaign effectiveness.",
  },
  {
    name: "Team Collaboration Tool",
    description:
      "A project management and collaboration platform with task boards, real-time chat, file sharing, time tracking, and team performance reporting.",
  },
];

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["Next.js", "TypeScript", "PostgreSQL"]);
  const [errors, setErrors] = useState<{ name?: string; description?: string; techStack?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  function toggleTech(tech: string) {
    setTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  function fillExample(example: typeof EXAMPLE_PROJECTS[0]) {
    setName(example.name);
    setDescription(example.description);
    setErrors({});
  }

  function validate() {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Project name is required";
    if (description.trim().length < 10)
      newErrors.description = "Please provide a meaningful description (at least 10 characters)";
    if (techStack.length === 0) newErrors.techStack = "Select at least one technology";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), techStack }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setErrors({ name: data.error ?? "Failed to create project" });
        return;
      }
      const data = await res.json() as { data: { id: string } };
      router.push(`/projects/${data.data.id}`);
    } catch {
      setErrors({ name: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Example projects */}
      <div>
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Quick Start Examples
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EXAMPLE_PROJECTS.map((example) => (
            <button
              key={example.name}
              type="button"
              onClick={() => fillExample(example)}
              className={cn(
                "text-left p-3 rounded-lg border transition-all duration-150 text-xs",
                name === example.name
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                  : "border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
              )}
            >
              {name === example.name && (
                <CheckCircle2 className="h-3 w-3 text-blue-400 mb-1.5" />
              )}
              <div className="font-medium mb-0.5 text-inherit leading-tight">
                {example.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project name */}
      <div>
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Project Details
        </div>
        <Input
          label="Project Name"
          placeholder="e.g. AI Customer Support Platform"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Product Description"
        placeholder="Describe what you want to build. Be specific — the more context you provide, the richer the AI output will be.

Example: Build a SaaS customer support platform where businesses can manage customer conversations, AI-generated replies, support tickets, and analytics..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        rows={6}
        hint="Aim for 2-5 sentences describing the core product, target users, and key features."
      />

      {/* Tech stack */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-300">Technology Stack</label>
          <span className="text-xs text-zinc-500">{techStack.length} selected</span>
        </div>
        {errors.techStack && (
          <p className="text-xs text-red-400 mb-2">{errors.techStack}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {TECH_OPTIONS.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-150",
                techStack.includes(tech)
                  ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
              )}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
          <Zap className="h-4 w-4" />
          Create Project &amp; Start Factory
        </Button>
      </div>
    </form>
  );
}
