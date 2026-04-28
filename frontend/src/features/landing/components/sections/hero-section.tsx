import type { CSSProperties, RefObject } from "react";
import Link from "next/link";
import { ArrowRight, ChartColumnIncreasing } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { ProgressBar } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  copy: LandingCopy;
  heroHeadlineStyle: CSSProperties;
  previewRef: RefObject<HTMLDivElement | null>;
};

export function HeroSection({
  copy,
  heroHeadlineStyle,
  previewRef,
}: HeroSectionProps) {
  const heroStats = [copy.showcase.stats[0], copy.showcase.stats[1]];
  const mobilePrinciples = copy.hero.principles.slice(0, 2);

  return (
    <section className="relative grid flex-1 items-center gap-8 pb-10 pt-5 sm:gap-16 sm:pb-20 sm:pt-12 lg:grid-cols-[minmax(0,0.98fr)_minmax(480px,1.02fr)] lg:gap-1 lg:pt-6">
      <div className="relative max-w-[35rem] space-y-5 sm:space-y-10 lg:self-start">
        <div
          className="landing-reveal inline-flex items-center gap-2 rounded-full border border-(--landing-border-strong) bg-(--landing-surface) px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-(--landing-text-muted) shadow-[var(--landing-shadow-soft)] sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.28em]"
          style={revealStyle(40)}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-(--landing-accent) shadow-[0_0_18px_var(--landing-glow)]" />
          {copy.hero.badge}
        </div>

        <div className="space-y-5 sm:space-y-7">
          <div className="landing-reveal space-y-4 sm:space-y-6" style={revealStyle(120)}>
            <h1
              className="text-[clamp(2.5rem,13vw,6.9rem)] leading-[0.94] font-semibold tracking-[-0.06em] text-(--landing-text) sm:leading-[0.9] sm:tracking-[-0.068em]"
              style={heroHeadlineStyle}
            >
              {copy.hero.headline}
            </h1>
            <p className="max-w-[31rem] text-[15px] leading-6 text-(--landing-text-muted) sm:text-[1.14rem] sm:leading-8">
              {copy.hero.subheadline}
            </p>
          </div>

          <div
            className="landing-reveal flex flex-col gap-3 sm:flex-row"
            style={revealStyle(200)}
          >
            <Link
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-(--landing-button-primary) px-5 text-sm font-medium text-(--landing-button-primary-text) shadow-[var(--landing-button-accent-shadow)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--landing-button-accent-shadow-hover)] sm:w-auto"
              href="/signup"
            >
              {copy.hero.ctaPrimary}
              <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              className="hidden h-12 items-center justify-center rounded-full border border-(--landing-border) bg-(--landing-button-secondary) px-5 text-sm font-medium text-(--landing-text-soft) transition duration-300 hover:-translate-y-0.5 hover:border-(--landing-border-strong) hover:bg-(--landing-button-secondary-hover) hover:text-(--landing-text) sm:inline-flex"
              href="#showcase"
            >
              {copy.hero.ctaSecondary}
            </Link>
          </div>

          <div
            className="landing-reveal grid gap-2 sm:hidden"
            style={revealStyle(240)}
          >
            <div className="grid grid-cols-2 gap-2">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.2rem] border border-(--landing-border) bg-(--landing-surface) px-3 py-3 shadow-[var(--landing-shadow-soft)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-(--landing-text-faint)">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-(--landing-text)">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <details className="group rounded-[1.2rem] border border-(--landing-border) bg-(--landing-surface) px-4 py-2.5 shadow-[var(--landing-shadow-soft)]">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-(--landing-text) [&::-webkit-details-marker]:hidden">
                <span>{copy.hero.preview.title}</span>
                <ArrowRight className="size-4 shrink-0 text-(--landing-text-faint) transition group-open:rotate-90" />
              </summary>
              <div className="space-y-2 pb-2 pt-2">
                {mobilePrinciples.map((principle) => (
                  <p
                    key={principle}
                    className="text-sm leading-6 text-(--landing-text-muted)"
                  >
                    {principle}
                  </p>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div
          className="landing-reveal hidden gap-3 sm:grid sm:max-w-[34rem] sm:grid-cols-3"
          style={revealStyle(280)}
        >
          {copy.hero.principles.map((principle, index) => (
            <div
              key={principle}
              className="landing-card-soft group rounded-[1.4rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface),transparent)] px-4 py-4 shadow-[var(--landing-shadow-soft)]"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-(--landing-text-faint)">
                0{index + 1}
              </p>
              <div className="mt-3 h-px w-8 bg-[linear-gradient(90deg,var(--landing-accent),transparent)] opacity-80" />
              <p className="mt-3 text-sm text-(--landing-text-soft)">
                {principle}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden sm:block lg:pl-2">
        <div
          ref={previewRef}
          className="landing-preview landing-reveal relative mx-auto max-w-[43rem]"
          style={revealStyle(140)}
        >
          <div className="absolute left-1/2 top-[46%] -z-20 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--landing-preview-aura)] blur-[150px] opacity-65" />

          <div className="landing-preview-shell relative rounded-[2.85rem] border border-(--landing-preview-frame) p-[1px] shadow-[var(--landing-preview-shell-shadow)]">
            <div className="landing-preview-glass absolute inset-0 rounded-[inherit]" />
            <div className="landing-preview-reactive absolute inset-0 rounded-[inherit]" />
            <div className="relative overflow-hidden rounded-[calc(2.85rem-1px)] bg-[var(--landing-panel)] p-4 sm:p-5">
              <div className="relative rounded-[2.15rem] border border-(--landing-border) bg-[var(--landing-preview-inner-surface)] p-5 shadow-[var(--landing-preview-inner-shadow)] sm:p-6">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--landing-accent-ember),transparent)] opacity-70" />
                <div className="pointer-events-none absolute right-5 top-5 hidden items-center gap-3 rounded-full border border-(--landing-border) bg-(--landing-bg-elevated) px-3 py-2 text-xs shadow-[var(--landing-shadow-soft)] sm:flex">
                  <span className="h-2 w-2 rounded-full bg-(--landing-accent) shadow-[0_0_14px_var(--landing-glow)]" />
                  <span className="text-(--landing-text-soft)">
                    {copy.hero.preview.aligned}
                  </span>
                </div>

                <div className="flex items-center gap-3 border-b border-(--landing-border) pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-(--landing-text-faint)/50" />
                    <span className="h-2.5 w-2.5 rounded-full bg-(--landing-text-faint)/35" />
                    <span className="h-2.5 w-2.5 rounded-full bg-(--landing-accent)/65 shadow-[0_0_18px_var(--landing-glow)]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-(--landing-text-faint)">
                      {copy.hero.preview.today}
                    </p>
                    <p className="mt-2 text-xl font-medium text-(--landing-text)">
                      {copy.hero.preview.title}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="space-y-4">
                    {copy.hero.preview.metrics.map((metric) => (
                      <PreviewMetric key={metric.label} {...metric} />
                    ))}

                    <div className="landing-card-soft rounded-[1.6rem] border border-(--landing-border) bg-(--landing-surface) p-5 shadow-[var(--landing-shadow-soft)]">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-(--landing-text-faint)">
                        <span>{copy.hero.preview.consistencyLabel}</span>
                        <span>{copy.hero.preview.consistencyPeriod}</span>
                      </div>
                      <ProgressBar className="mt-5" value="82%" />
                      <p className="mt-4 text-sm leading-7 text-(--landing-text-muted)">
                        {copy.hero.preview.consistencyBody}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="landing-card-soft rounded-[1.7rem] border border-(--landing-border) bg-(--landing-surface-alt) p-5 shadow-[var(--landing-shadow-soft)]">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-(--landing-text)">
                          {copy.hero.preview.dailyFlow}
                        </p>
                        <p className="text-xs text-(--landing-text-faint)">
                          {copy.hero.preview.dailyFlowCaption}
                        </p>
                      </div>

                      <div className="mt-5 space-y-3">
                        {copy.hero.preview.rows.map((row) => (
                          <FlowRow key={row.title} {...row} />
                        ))}
                      </div>
                    </div>

                    <div className="landing-card-soft rounded-[1.7rem] border border-(--landing-border) bg-(--landing-surface) p-5 shadow-[var(--landing-shadow-soft)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-(--landing-text-faint)">
                            {copy.showcase.weeklySummary}
                          </p>
                          <p className="mt-2 text-lg font-medium text-(--landing-text)">
                            {copy.showcase.systemHealth.title}
                          </p>
                        </div>
                        <ChartColumnIncreasing className="size-5 text-(--landing-text-faint)" />
                      </div>

                      <div className="mt-6 space-y-4">
                        {copy.showcase.systemHealth.rows.map((row) => (
                          <ChartRow key={row.label} {...row} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="landing-card-soft rounded-[1.4rem] border border-(--landing-border) bg-(--landing-surface) px-4 py-4 shadow-[var(--landing-shadow-soft)]"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-(--landing-text-faint)">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-lg font-medium text-(--landing-text)">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 left-6 hidden rounded-[1.4rem] border border-(--landing-border) bg-(--landing-bg-elevated) px-4 py-3 text-xs text-(--landing-text-soft) shadow-[var(--landing-shadow-soft)] backdrop-blur-xl xl:flex xl:items-center xl:gap-3">
            <span className="h-2 w-2 rounded-full bg-(--landing-accent-warm) shadow-[0_0_18px_var(--landing-accent-warm)]" />
            {copy.hero.preview.consistencyLabel}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewMetric({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="landing-card-strong rounded-[1.45rem] border border-(--landing-border) bg-(--landing-surface) p-4 shadow-[var(--landing-shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-(--landing-text)">{label}</p>
          <p className="mt-1 text-sm text-(--landing-text-faint)">{detail}</p>
        </div>
        <p className="text-3xl font-semibold tracking-[-0.05em] text-(--landing-text)">
          {value}
        </p>
      </div>
    </div>
  );
}

function FlowRow({
  badge,
  detail,
  status,
  title,
}: {
  badge: string;
  detail: string;
  status: "done" | "live" | "next";
  title: string;
}) {
  const statusClasses = {
    done: "bg-(--status-done-bg) text-(--status-done-text)",
    live: "bg-(--status-live-bg) text-(--status-live-text)",
    next: "bg-(--status-next-bg) text-(--status-next-text)",
  };

  return (
    <div className="landing-card-soft flex items-center justify-between gap-4 rounded-[1.3rem] border border-(--landing-border) bg-(--landing-surface) px-4 py-3 shadow-[var(--landing-shadow-soft)]">
      <div>
        <p className="text-sm font-medium text-(--landing-text)">{title}</p>
        <p className="mt-1 text-sm text-(--landing-text-faint)">{detail}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
          statusClasses[status],
        )}
      >
        {badge}
      </span>
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
