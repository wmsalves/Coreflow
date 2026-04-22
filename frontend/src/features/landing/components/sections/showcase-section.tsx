import { ChartColumnIncreasing } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { ProgressBar, SectionDivider, SectionIntro } from "@/features/landing/components/landing-primitives";
import { SignalPanel } from "@/features/landing/components/sections/solution-section";
import { revealStyle } from "@/features/landing/lib/reveal";

type ShowcaseSectionProps = {
  copy: LandingCopy["showcase"];
};

export function ShowcaseSection({ copy }: ShowcaseSectionProps) {
  return (
    <section className="relative py-14 sm:py-22" id="showcase">
      <SectionDivider />
      <SectionIntro
        centered
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-[1.24fr_0.76fr]">
        <div className="landing-reveal" style={revealStyle(80)}>
          <div
            data-card-motion="panel"
            className="landing-card-strong overflow-hidden rounded-[1.6rem] border border-(--landing-border) bg-[var(--landing-panel)] p-4 shadow-[var(--landing-shadow)] sm:rounded-[2.4rem] sm:p-6"
          >
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[1.7rem] border border-(--landing-border) bg-(--landing-surface) p-5 shadow-[var(--landing-shadow-soft)]">
                <p className="text-xs uppercase tracking-[0.24em] text-(--landing-text-faint)">
                  {copy.weeklySummary}
                </p>
                <div className="mt-7 space-y-6">
                  {copy.stats.map((stat) => (
                    <MetricBlock key={stat.label} {...stat} />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-(--landing-border) bg-(--landing-surface-alt) p-5 shadow-[var(--landing-shadow-soft)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-(--landing-text)">
                    {copy.systemHealth.title}
                  </p>
                  <ChartColumnIncreasing className="size-5 text-(--landing-text-faint)" />
                </div>

                <div className="mt-8 space-y-6">
                  {copy.systemHealth.rows.map((row) => (
                    <ChartRow key={row.label} {...row} />
                  ))}
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-3">
                  {copy.summaryChips.map((chip) => (
                    <ShowcaseChip key={chip.label} {...chip} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {copy.highlightCards.map((card, index) => (
            <SignalPanel
              key={card.title}
              style={revealStyle(120 + index * 70)}
              {...card}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-(--landing-text-faint)">
        {label}
      </p>
        <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-(--landing-text) sm:text-4xl">
        {value}
      </p>
    </div>
  );
}

function ChartRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-(--landing-text-soft)">{label}</span>
        <span className="text-(--landing-text-faint)">{value}</span>
      </div>
      <ProgressBar className="mt-3" value={width} />
    </div>
  );
}

function ShowcaseChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="landing-card-soft rounded-[1.25rem] border border-(--landing-border) bg-(--landing-surface) px-4 py-4 shadow-[var(--landing-shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-(--landing-text-faint)">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-(--landing-text)">{value}</p>
    </div>
  );
}
