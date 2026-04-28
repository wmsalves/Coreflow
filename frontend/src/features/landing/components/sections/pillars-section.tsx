import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Dumbbell, Flame, TimerReset } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { SectionDivider, SectionIntro } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";

const pillarIcons: Record<"habits" | "focus" | "fitness", LucideIcon> = {
  fitness: Dumbbell,
  focus: TimerReset,
  habits: Flame,
};

type PillarsSectionProps = {
  copy: LandingCopy["pillars"];
};

export function PillarsSection({ copy }: PillarsSectionProps) {
  return (
    <section className="relative py-14 sm:py-22" id="pillars">
      <SectionDivider />
      <SectionIntro
        centered
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3">
        {copy.cards.map((pillar, index) => (
          <PillarCard
            footerLabel={copy.footerLabel}
            key={pillar.kicker}
            description={pillar.description}
            icon={pillarIcons[pillar.key]}
            kicker={pillar.kicker}
            stat={pillar.stat}
            style={revealStyle(80 + index * 70)}
            value={pillar.value}
          />
        ))}
      </div>
    </section>
  );
}

function PillarCard({
  description,
  footerLabel,
  icon: Icon,
  kicker,
  stat,
  style,
  value,
}: {
  description: string;
  footerLabel: string;
  icon: LucideIcon;
  kicker: string;
  stat: string;
  style?: CSSProperties;
  value: string;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <details className="landing-card-strong group rounded-[1.2rem] border border-(--landing-border) bg-[var(--landing-panel)] px-4 py-2.5 shadow-[var(--landing-shadow-soft)] sm:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-3">
            <div className="rounded-[0.95rem] border border-(--landing-border) bg-(--landing-surface) p-2.5 shadow-[var(--landing-shadow-soft)]">
              <Icon className="size-4 text-(--landing-text-soft)" />
            </div>
            <div>
              <p className="text-sm font-medium text-(--landing-text)">{kicker}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-(--landing-text-faint)">
                {stat}
              </p>
            </div>
          </div>
          <ChevronDown className="size-4 shrink-0 text-(--landing-text-faint) transition group-open:rotate-180" />
        </summary>
        <div className="space-y-3 pb-2 pt-2">
          <p className="text-sm leading-6 text-(--landing-text-muted)">
            {description}
          </p>
          <div className="border-t border-(--landing-border) pt-3">
            <p className="text-xs text-(--landing-text-faint)">{footerLabel}</p>
            <p className="mt-1 text-sm font-medium text-(--landing-text)">{value}</p>
          </div>
        </div>
      </details>

      <div
        data-card-motion="follow"
        className="landing-card-strong group relative hidden h-full overflow-hidden rounded-[1.45rem] border border-(--landing-border) bg-[var(--landing-panel)] p-5 shadow-[var(--landing-shadow-soft)] sm:block sm:rounded-[2.1rem] sm:p-6"
      >
        <div className="relative flex items-center justify-between">
          <div className="rounded-[1.25rem] border border-(--landing-border) bg-(--landing-surface) p-3 shadow-[var(--landing-shadow-soft)]">
            <Icon className="size-5 text-(--landing-text-soft)" />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-(--landing-text-faint)">
            {stat}
          </p>
        </div>
        <p className="relative mt-8 text-2xl font-medium tracking-[-0.04em] text-(--landing-text)">
          {kicker}
        </p>
        <p className="relative mt-4 text-sm leading-7 text-(--landing-text-muted)">
          {description}
        </p>
        <div className="relative mt-8 border-t border-(--landing-border) pt-4">
          <p className="text-sm text-(--landing-text-faint)">{footerLabel}</p>
          <p className="mt-2 text-base font-medium text-(--landing-text)">{value}</p>
        </div>
      </div>
    </div>
  );
}
