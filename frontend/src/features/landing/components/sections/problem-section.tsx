import type { CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { SectionDivider, SectionIntro } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";

type ProblemSectionProps = {
  copy: LandingCopy["problem"];
};

export function ProblemSection({ copy }: ProblemSectionProps) {
  return (
    <section className="relative py-14 sm:py-22" id="problem">
      <SectionDivider />
      <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <SectionIntro
          description={copy.description}
          eyebrow={copy.eyebrow}
          title={copy.title}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {copy.panels.map((panel, index) => (
            <ProblemPanel
              key={panel.title}
              style={revealStyle(60 + index * 80)}
              {...panel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemPanel({
  body,
  style,
  title,
}: {
  body: string;
  style?: CSSProperties;
  title: string;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <details
        className="landing-card-strong group h-full rounded-[1.45rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-5 shadow-[var(--landing-shadow-soft)] sm:hidden"
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-xl font-medium tracking-[-0.04em] text-(--landing-text) [&::-webkit-details-marker]:hidden">
          <span>{title}</span>
          <ChevronDown className="size-4 shrink-0 text-(--landing-text-faint) transition group-open:rotate-180" />
        </summary>
        <p className="mt-4 text-sm leading-7 text-(--landing-text-muted)">
          {body}
        </p>
      </details>

      <div
        data-card-motion="follow"
        className="landing-card-strong hidden h-full rounded-[1.45rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-5 shadow-[var(--landing-shadow-soft)] sm:block sm:rounded-[2rem] sm:p-6"
      >
        <p className="text-xl font-medium tracking-[-0.04em] text-(--landing-text)">
          {title}
        </p>
        <p className="mt-4 text-sm leading-7 text-(--landing-text-muted)">
          {body}
        </p>
      </div>
    </div>
  );
}
