import { LayoutDashboard } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { ProgressBar, SectionDivider, SectionIntro } from "@/features/landing/components/landing-primitives";
import { SignalPanel } from "@/features/landing/components/sections/solution-section";
import { revealStyle } from "@/features/landing/lib/reveal";

type DailyFlowSectionProps = {
  copy: LandingCopy["workflow"];
};

export function DailyFlowSection({ copy }: DailyFlowSectionProps) {
  return (
    <section className="relative hidden py-14 sm:block sm:py-22" id="daily-flow">
      <SectionDivider />
      <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-8">
          <SectionIntro
            description={copy.description}
            eyebrow={copy.eyebrow}
            title={copy.title}
          />

          <div className="space-y-4">
            {copy.rows.map((item, index) => (
              <div
                key={item.step}
                className="landing-card-soft landing-reveal flex gap-4 rounded-[1.8rem] border border-(--landing-border) bg-(--landing-surface) p-5 shadow-[var(--landing-shadow-soft)]"
                style={revealStyle(80 + index * 80)}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-(--landing-border) bg-(--landing-surface-strong) text-sm text-(--landing-text-soft) shadow-[var(--landing-chip-inset-shadow)]">
                  0{index + 1}
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-(--landing-text)">
                    {item.step}
                  </p>
                  <p className="text-sm leading-7 text-(--landing-text-muted)">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="landing-reveal" style={revealStyle(90)}>
            <div
              data-card-motion="panel"
              className="landing-card-strong overflow-hidden rounded-[1.55rem] border border-(--landing-border) bg-[var(--landing-panel)] p-4 shadow-[var(--landing-shadow)] sm:rounded-[2.3rem] sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-(--landing-text-faint)">
                    {copy.todayView.label}
                  </p>
                  <p className="mt-2 text-2xl font-medium text-(--landing-text)">
                    {copy.todayView.title}
                  </p>
                </div>
                <LayoutDashboard className="size-5 text-(--landing-text-faint)" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-3 rounded-[1.6rem] border border-(--landing-border) bg-(--landing-surface) p-4">
                  {copy.todayView.stats.map((stat) => (
                    <MiniStat key={stat.label} {...stat} />
                  ))}
                </div>

                <div className="space-y-3">
                  {copy.todayView.unifiedRows.map((row) => (
                    <UnifiedRow key={row.label} {...row} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {copy.highlights.map((highlight, index) => (
              <SignalPanel
                key={highlight.title}
                style={revealStyle(140 + index * 60)}
                {...highlight}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="landing-card-soft rounded-[1.25rem] border border-(--landing-border) bg-(--landing-surface-alt) px-4 py-4 shadow-[var(--landing-shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-(--landing-text-faint)">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-(--landing-text)">
        {value}
      </p>
    </div>
  );
}

function UnifiedRow({
  label,
  note,
  progress,
}: {
  label: string;
  note: string;
  progress: string;
}) {
  return (
    <div className="landing-card-soft rounded-[1.4rem] border border-(--landing-border) bg-(--landing-surface) p-4 shadow-[var(--landing-shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-(--landing-text)">{label}</p>
        <p className="text-sm text-(--landing-text-faint)">{progress}</p>
      </div>
      <p className="mt-2 text-sm text-(--landing-text-muted)">{note}</p>
      <ProgressBar className="mt-4" value={progress} />
    </div>
  );
}
