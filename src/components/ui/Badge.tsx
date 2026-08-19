import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "pending";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  dot,
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    pending: "bg-zinc-700/50 text-zinc-400 border-zinc-600/50",
  };

  const dotColors = {
    default: "bg-zinc-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-red-400",
    info: "bg-blue-400",
    pending: "bg-zinc-500",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColors[variant],
            variant === "info" && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
