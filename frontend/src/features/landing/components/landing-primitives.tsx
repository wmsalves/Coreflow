import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionDivider() {
  return (
    <div className="mb-8 h-px w-full bg-[linear-gradient(90deg,transparent,var(--landing-border-strong),transparent)]" />
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-(--landing-text-faint)">
      {children}
    </p>
  );
}

export function SectionIntro({
  centered = false,
  description,
  eyebrow,
  title,
}: {
  centered?: boolean;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "landing-reveal",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
      )}
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-(--landing-text) sm:text-[2.7rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-(--landing-text-muted)">
        {description}
      </p>
    </div>
  );
}

export function ProgressBar({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  return (
    <div className={cn("h-2 rounded-full bg-(--track-bg)", className)}>
      <div
        className="h-2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--landing-progress-start), var(--landing-progress-end))",
          boxShadow: "0 0 28px var(--landing-accent-soft)",
          width: value,
        }}
      />
    </div>
  );
}
