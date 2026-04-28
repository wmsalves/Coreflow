import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "landing-card-soft rounded-[1.3rem] border border-[var(--landing-border)] bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] shadow-[var(--landing-shadow-soft)] sm:rounded-[1.7rem]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 px-4 py-4 sm:px-6 sm:py-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold tracking-[-0.025em] text-[var(--landing-text)]", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-[1.55] text-[var(--landing-text-muted)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pb-4 sm:px-6 sm:pb-5", className)} {...props} />;
}
