import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "success";
};

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[rgba(31,122,99,0.12)] text-[var(--accent)]",
  muted: "bg-[rgba(19,33,29,0.08)] text-[var(--muted)]",
  success: "bg-[rgba(31,122,99,0.14)] text-[var(--accent)]",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
