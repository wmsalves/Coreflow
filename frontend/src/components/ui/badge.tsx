import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "success";
};

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "border border-[var(--landing-accent-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-accent)]",
  muted:
    "border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)]",
  success:
    "border border-[color-mix(in_srgb,var(--landing-accent)_24%,var(--landing-border))] bg-[color-mix(in_srgb,var(--landing-accent-soft)_72%,white_20%)] text-[color-mix(in_srgb,var(--landing-accent)_78%,black_10%)]",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[var(--landing-chip-inset-shadow)]",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
