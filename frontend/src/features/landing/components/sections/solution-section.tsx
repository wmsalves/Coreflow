import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { SectionDivider, SectionLabel } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";

type SolutionSectionProps = {
  copy: LandingCopy["solution"];
};

export function SolutionSection({ copy }: SolutionSectionProps) {
  return (
    <section className="relative py-14 sm:py-22">
      <SectionDivider />
      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="landing-reveal" style={revealStyle(60)}>
          <div
            data-card-motion="panel"
            className="landing-card-strong overflow-hidden rounded-[1.6rem] border border-(--landing-border) bg-[var(--landing-panel)] px-5 py-6 shadow-[var(--landing-shadow-soft)] sm:rounded-[2.4rem] sm:px-7 sm:py-8"
          >
            <div className="max-w-2xl space-y-5">
              <SectionLabel>{copy.eyebrow}</SectionLabel>
              <h2 className="text-2xl font-semibold tracking-[-0.05em] text-(--landing-text) sm:text-[2.6rem]">
                {copy.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-(--landing-text-muted)">
                {copy.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {copy.points.map((point, index) => (
            <SignalPanel
              key={point.title}
              mobileCompact
              style={revealStyle(120 + index * 70)}
              {...point}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SignalPanel({
  body,
  kicker,
  mobileCompact = false,
  style,
  title,
}: {
  body: string;
  kicker: string;
  mobileCompact?: boolean;
  style?: CSSProperties;
  title: string;
}) {
  return (
    <div className="landing-reveal" style={style}>
      {mobileCompact ? (
        <details className="landing-card-soft group rounded-[1.2rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] px-4 py-2.5 shadow-[var(--landing-shadow-soft)] sm:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--landing-text-faint)">
                {kicker}
              </p>
              <p className="mt-1 text-base font-medium text-(--landing-text)">{title}</p>
            </div>
            <ChevronDown className="size-4 shrink-0 text-(--landing-text-faint) transition group-open:rotate-180" />
          </summary>
          <p className="pb-2 pt-2 text-sm leading-6 text-(--landing-text-muted)">
            {body}
          </p>
        </details>
      ) : null}

      <div
        className="landing-card-soft group hidden rounded-[1.35rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-4 shadow-[var(--landing-shadow-soft)] sm:block sm:rounded-[1.8rem] sm:p-5"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-(--landing-text-faint)">
          {kicker}
        </p>
        <p className="mt-3 text-lg font-medium text-(--landing-text)">{title}</p>
        <p className="mt-3 text-sm leading-6 text-(--landing-text-muted)">
          {body}
        </p>
      </div>
    </div>
  );
}
