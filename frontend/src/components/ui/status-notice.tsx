import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusNoticeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: "error" | "info" | "success";
};

const noticeStyles: Record<NonNullable<StatusNoticeProps["variant"]>, string> = {
  success:
    "border-[var(--landing-border-strong)] bg-[var(--landing-accent-soft)] text-[var(--landing-text)]",
  info: "border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-text-muted)]",
  error: "border-[rgba(204,90,67,0.3)] bg-[rgba(204,90,67,0.08)] text-[var(--danger)]",
};

const noticeIcons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
} as const;

export function StatusNotice({
  children,
  className,
  variant = "info",
  ...props
}: StatusNoticeProps) {
  const Icon = noticeIcons[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[1.2rem] border px-4 py-3 text-sm leading-6",
        noticeStyles[variant],
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
