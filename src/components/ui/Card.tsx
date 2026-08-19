import { cn } from "@/lib/utils/cn";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ className, children, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-xl",
        hover && "cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/80 transition-colors duration-150",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-5 py-4 border-b border-zinc-800", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-5 py-4", className)}>{children}</div>
  );
}

export function CardFooter({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-5 py-3 border-t border-zinc-800", className)}>
      {children}
    </div>
  );
}
