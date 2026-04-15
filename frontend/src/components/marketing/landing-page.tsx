"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChartColumnIncreasing,
  Dumbbell,
  Flame,
  LayoutDashboard,
  TimerReset,
} from "lucide-react";
import { LandingHeader } from "@/components/marketing/landing-header";
import {
  landingCopy,
  type LandingLocale,
} from "@/components/marketing/landing-copy";
import { type LandingTheme } from "@/components/marketing/theme-toggle";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "coreflow:landing-theme";
const LOCALE_STORAGE_KEY = "coreflow:landing-locale";

const landingThemeStyles = {
  dark: {
    "--landing-accent": "#9aa7ff",
    "--landing-bg": "#05070a",
    "--landing-border": "rgba(255,255,255,0.1)",
    "--landing-button-primary": "#f7f8fb",
    "--landing-button-primary-text": "#05070a",
    "--landing-button-secondary": "rgba(255,255,255,0.03)",
    "--landing-button-secondary-hover": "rgba(255,255,255,0.06)",
    "--landing-header": "rgba(8,10,15,0.84)",
    "--landing-logo-frame": "rgba(255,255,255,0.04)",
    "--landing-progress-end": "#95a1ff",
    "--landing-progress-start": "#f7f8fb",
    "--landing-shadow": "0 28px 90px rgba(0,0,0,0.36)",
    "--landing-surface": "rgba(255,255,255,0.03)",
    "--landing-surface-alt": "#0b1017",
    "--landing-surface-strong": "rgba(255,255,255,0.055)",
    "--landing-text": "#f7f9fc",
    "--landing-text-faint": "rgba(247,249,252,0.38)",
    "--landing-text-muted": "rgba(247,249,252,0.62)",
    "--landing-text-soft": "rgba(247,249,252,0.78)",
    "--status-done-bg": "#9ae6b4",
    "--status-done-text": "#083a28",
    "--status-live-bg": "#f7f8fb",
    "--status-live-text": "#05070a",
    "--status-next-bg": "rgba(255,255,255,0.1)",
    "--status-next-text": "rgba(247,249,252,0.68)",
    "--track-bg": "rgba(255,255,255,0.07)",
  },
  light: {
    "--landing-accent": "#5b74ff",
    "--landing-bg": "#f4f6fb",
    "--landing-border": "rgba(15,23,42,0.1)",
    "--landing-button-primary": "#0f172a",
    "--landing-button-primary-text": "#f8fafc",
    "--landing-button-secondary": "rgba(255,255,255,0.72)",
    "--landing-button-secondary-hover": "rgba(255,255,255,0.96)",
    "--landing-header": "rgba(255,255,255,0.82)",
    "--landing-logo-frame": "rgba(255,255,255,0.96)",
    "--landing-progress-end": "#6e84ff",
    "--landing-progress-start": "#0f172a",
    "--landing-shadow": "0 24px 80px rgba(17,24,39,0.1)",
    "--landing-surface": "rgba(255,255,255,0.76)",
    "--landing-surface-alt": "#eef2f8",
    "--landing-surface-strong": "rgba(255,255,255,0.96)",
    "--landing-text": "#0f172a",
    "--landing-text-faint": "rgba(15,23,42,0.38)",
    "--landing-text-muted": "rgba(15,23,42,0.66)",
    "--landing-text-soft": "rgba(15,23,42,0.82)",
    "--status-done-bg": "#d1fae5",
    "--status-done-text": "#065f46",
    "--status-live-bg": "#0f172a",
    "--status-live-text": "#f8fafc",
    "--status-next-bg": "rgba(15,23,42,0.08)",
    "--status-next-text": "rgba(15,23,42,0.62)",
    "--track-bg": "rgba(15,23,42,0.08)",
  },
} satisfies Record<LandingTheme, Record<string, string>>;

const pillarIcons: Record<"habits" | "focus" | "fitness", LucideIcon> = {
  fitness: Dumbbell,
  focus: TimerReset,
  habits: Flame,
};

function getInitialTheme(): LandingTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "light" ? "light" : "dark";
}

function getInitialLocale(): LandingLocale {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  if (savedLocale === "en" || savedLocale === "pt-BR") {
    return savedLocale;
  }

  return window.navigator.language.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

export function LandingPage() {
  const [theme, setTheme] = useState<LandingTheme>(getInitialTheme);
  const [locale, setLocale] = useState<LandingLocale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const copy = landingCopy[locale];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[color:var(--landing-bg)] text-[color:var(--landing-text)]"
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-16 pt-5 sm:px-6 lg:px-8">
        <LandingHeader
          controls={copy.controls}
          copy={copy.header}
          locale={locale}
          onLocaleChange={setLocale}
          onThemeChange={setTheme}
          theme={theme}
        />

        <section className="grid flex-1 items-start gap-16 pb-18 pt-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] lg:pt-24">
          <div className="max-w-3xl space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--landing-text-muted)]">
              {copy.hero.badge}
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-[clamp(3.3rem,8vw,6.8rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-[color:var(--landing-text)]">
                {copy.hero.headline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--landing-text-muted)] sm:text-xl">
                {copy.hero.subheadline}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--landing-button-primary)] px-5 text-sm font-medium text-[color:var(--landing-button-primary-text)] transition hover:opacity-95"
                href="/signup"
              >
                {copy.hero.ctaPrimary}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] px-5 text-sm font-medium text-[color:var(--landing-text-soft)] transition hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]"
                href="#showcase"
              >
                {copy.hero.ctaSecondary}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {copy.hero.principles.map((principle) => (
                <div
                  key={principle}
                  className="rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-4 text-sm text-[color:var(--landing-text-soft)]"
                >
                  {principle}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-3">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,var(--landing-accent),transparent_58%)] opacity-12 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] p-4 shadow-[var(--landing-shadow)]">
              <div className="rounded-[1.5rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
                <div className="flex items-center justify-between border-b border-[color:var(--landing-border)] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                      {copy.hero.preview.today}
                    </p>
                    <p className="mt-2 text-xl font-medium text-[color:var(--landing-text)]">
                      {copy.hero.preview.title}
                    </p>
                  </div>
                  <div className="rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-3 py-1 text-xs text-[color:var(--landing-text-soft)]">
                    {copy.hero.preview.aligned}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    {copy.hero.preview.metrics.map((metric) => (
                      <PreviewMetric key={metric.label} {...metric} />
                    ))}
                  </div>

                  <div className="rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[color:var(--landing-text)]">
                        {copy.hero.preview.dailyFlow}
                      </p>
                      <p className="text-xs text-[color:var(--landing-text-faint)]">
                        {copy.hero.preview.dailyFlowCaption}
                      </p>
                    </div>

                    <div className="mt-5 space-y-4">
                      {copy.hero.preview.rows.map((row) => (
                        <FlowRow key={row.title} {...row} />
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--landing-text-faint)]">
                        <span>{copy.hero.preview.consistencyLabel}</span>
                        <span>{copy.hero.preview.consistencyPeriod}</span>
                      </div>
                      <ProgressBar className="mt-4" value="82%" />
                      <p className="mt-3 text-sm text-[color:var(--landing-text-muted)]">
                        {copy.hero.preview.consistencyBody}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="grid gap-6 border-t border-[color:var(--landing-border)] py-18 lg:grid-cols-[0.85fr_1.15fr]"
          id="problem"
        >
          <SectionIntro
            description={copy.problem.description}
            eyebrow={copy.problem.eyebrow}
            title={copy.problem.title}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {copy.problem.panels.map((panel) => (
              <ProblemPanel key={panel.title} {...panel} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-[color:var(--landing-border)] py-18 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] p-8">
            <div className="max-w-2xl space-y-5">
              <SectionLabel>{copy.solution.eyebrow}</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[color:var(--landing-text)] sm:text-4xl">
                {copy.solution.title}
              </h2>
              <p className="text-base leading-7 text-[color:var(--landing-text-muted)]">
                {copy.solution.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {copy.solution.points.map((point) => (
              <SignalPanel key={point.title} {...point} />
            ))}
          </div>
        </section>

        <section className="border-t border-[color:var(--landing-border)] py-18" id="pillars">
          <SectionIntro
            centered
            description={copy.pillars.description}
            eyebrow={copy.pillars.eyebrow}
            title={copy.pillars.title}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {copy.pillars.cards.map((pillar) => (
              <PillarCard
                footerLabel={copy.pillars.footerLabel}
                key={pillar.kicker}
                description={pillar.description}
                icon={pillarIcons[pillar.key]}
                kicker={pillar.kicker}
                stat={pillar.stat}
                value={pillar.value}
              />
            ))}
          </div>
        </section>

        <section
          className="grid gap-10 border-t border-[color:var(--landing-border)] py-18 lg:grid-cols-[0.92fr_1.08fr]"
          id="daily-flow"
        >
          <div className="space-y-8">
            <SectionIntro
              description={copy.workflow.description}
              eyebrow={copy.workflow.eyebrow}
              title={copy.workflow.title}
            />

            <div className="space-y-4">
              {copy.workflow.rows.map((item, index) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] text-sm text-[color:var(--landing-text-soft)]">
                    0{index + 1}
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-[color:var(--landing-text)]">
                      {item.step}
                    </p>
                    <p className="text-sm leading-6 text-[color:var(--landing-text-muted)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                    {copy.workflow.todayView.label}
                  </p>
                  <p className="mt-2 text-2xl font-medium text-[color:var(--landing-text)]">
                    {copy.workflow.todayView.title}
                  </p>
                </div>
                <LayoutDashboard className="size-5 text-[color:var(--landing-text-faint)]" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-3 rounded-[1.5rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
                  {copy.workflow.todayView.stats.map((stat) => (
                    <MiniStat key={stat.label} {...stat} />
                  ))}
                </div>

                <div className="space-y-3">
                  {copy.workflow.todayView.unifiedRows.map((row) => (
                    <UnifiedRow key={row.label} {...row} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {copy.workflow.highlights.map((highlight) => (
                <SignalPanel key={highlight.title} {...highlight} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--landing-border)] py-18" id="showcase">
          <SectionIntro
            centered
            description={copy.showcase.description}
            eyebrow={copy.showcase.eyebrow}
            title={copy.showcase.title}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] p-6">
              <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
                    {copy.showcase.weeklySummary}
                  </p>
                  <div className="mt-6 space-y-5">
                    {copy.showcase.stats.map((stat) => (
                      <MetricBlock key={stat.label} {...stat} />
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[color:var(--landing-text)]">
                      {copy.showcase.systemHealth.title}
                    </p>
                    <ChartColumnIncreasing className="size-5 text-[color:var(--landing-text-faint)]" />
                  </div>

                  <div className="mt-8 space-y-6">
                    {copy.showcase.systemHealth.rows.map((row) => (
                      <ChartRow key={row.label} {...row} />
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 md:grid-cols-3">
                    {copy.showcase.summaryChips.map((chip) => (
                      <ShowcaseChip key={chip.label} {...chip} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {copy.showcase.highlightCards.map((card) => (
                <SignalPanel key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--landing-border)] py-18" id="pricing">
          <SectionIntro
            centered
            description={copy.pricing.description}
            eyebrow={copy.pricing.eyebrow}
            title={copy.pricing.title}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {copy.pricing.plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </section>

        <section className="border-t border-[color:var(--landing-border)] py-18">
          <div className="rounded-[2.2rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <SectionLabel>{copy.finalCta.eyebrow}</SectionLabel>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[color:var(--landing-text)] sm:text-4xl">
                  {copy.finalCta.title}
                </h2>
                <p className="text-base leading-7 text-[color:var(--landing-text-muted)]">
                  {copy.finalCta.body}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--landing-button-primary)] px-5 text-sm font-medium text-[color:var(--landing-button-primary-text)] transition hover:opacity-95"
                  href="/signup"
                >
                  {copy.finalCta.primaryCta}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] px-5 text-sm font-medium text-[color:var(--landing-text-soft)] transition hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]"
                  href="/login"
                >
                  {copy.finalCta.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LandingBackdrop({ theme }: { theme: LandingTheme }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {theme === "dark" ? (
        <>
          <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(123,137,255,0.12),transparent_42%)]" />
          <div className="absolute right-[-12rem] top-32 h-96 w-96 rounded-full bg-[rgba(90,104,187,0.12)] blur-[140px]" />
          <div className="absolute left-[-10rem] top-[32rem] h-80 w-80 rounded-full bg-[rgba(74,90,145,0.09)] blur-[140px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(circle_at_top,rgba(112,130,255,0.16),transparent_48%)]" />
          <div className="absolute right-[-10rem] top-24 h-96 w-96 rounded-full bg-[rgba(122,142,255,0.16)] blur-[140px]" />
          <div className="absolute left-[-9rem] top-[28rem] h-80 w-80 rounded-full bg-[rgba(255,255,255,0.95)] blur-[120px]" />
        </>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--landing-text-faint)]">
      {children}
    </p>
  );
}

function SectionIntro({
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
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--landing-text)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[color:var(--landing-text-muted)]">
        {description}
      </p>
    </div>
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
    <div className="rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[color:var(--landing-text)]">{label}</p>
          <p className="mt-1 text-sm text-[color:var(--landing-text-faint)]">{detail}</p>
        </div>
        <p className="text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)]">
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
    done: "bg-[color:var(--status-done-bg)] text-[color:var(--status-done-text)]",
    live: "bg-[color:var(--status-live-bg)] text-[color:var(--status-live-text)]",
    next: "bg-[color:var(--status-next-bg)] text-[color:var(--status-next-text)]",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[color:var(--landing-text)]">{title}</p>
        <p className="mt-1 text-sm text-[color:var(--landing-text-faint)]">{detail}</p>
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

function ProblemPanel({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-[1.8rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-6">
      <p className="text-xl font-medium tracking-[-0.03em] text-[color:var(--landing-text)]">
        {title}
      </p>
      <p className="mt-4 text-sm leading-7 text-[color:var(--landing-text-muted)]">{body}</p>
    </div>
  );
}

function SignalPanel({
  body,
  kicker,
  title,
}: {
  body: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {kicker}
      </p>
      <p className="mt-3 text-lg font-medium text-[color:var(--landing-text)]">{title}</p>
      <p className="mt-3 text-sm leading-6 text-[color:var(--landing-text-muted)]">{body}</p>
    </div>
  );
}

function PillarCard({
  description,
  footerLabel,
  icon: Icon,
  kicker,
  stat,
  value,
}: {
  description: string;
  footerLabel: string;
  icon: LucideIcon;
  kicker: string;
  stat: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.9rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)] p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-3">
          <Icon className="size-5 text-[color:var(--landing-text-soft)]" />
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
          {stat}
        </p>
      </div>
      <p className="mt-6 text-2xl font-medium tracking-[-0.03em] text-[color:var(--landing-text)]">
        {kicker}
      </p>
      <p className="mt-4 text-sm leading-7 text-[color:var(--landing-text-muted)]">
        {description}
      </p>
      <div className="mt-8 border-t border-[color:var(--landing-border)] pt-4">
        <p className="text-sm text-[color:var(--landing-text-faint)]">{footerLabel}</p>
        <p className="mt-2 text-base font-medium text-[color:var(--landing-text)]">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-alt)] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--landing-text)]">
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
    <div className="rounded-[1.4rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[color:var(--landing-text)]">{label}</p>
        <p className="text-sm text-[color:var(--landing-text-faint)]">{progress}</p>
      </div>
      <p className="mt-2 text-sm text-[color:var(--landing-text-muted)]">{note}</p>
      <ProgressBar className="mt-4" value={progress} />
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[color:var(--landing-text)]">
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
        <span className="text-[color:var(--landing-text-soft)]">{label}</span>
        <span className="text-[color:var(--landing-text-faint)]">{value}</span>
      </div>
      <ProgressBar className="mt-3" value={width} />
    </div>
  );
}

function ShowcaseChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--landing-text-faint)]">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-[color:var(--landing-text)]">{value}</p>
    </div>
  );
}

function PricingCard({
  cta,
  detail,
  features,
  name,
  price,
}: {
  cta: string;
  detail: string;
  features: string[];
  name: string;
  price: string;
}) {
  const isPro = name === "Pro";

  return (
    <div
      className={cn(
        "rounded-[1.9rem] border p-6",
        isPro
          ? "border-[color:var(--landing-border)] bg-[color:var(--landing-surface-strong)]"
          : "border-[color:var(--landing-border)] bg-[color:var(--landing-surface)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--landing-text)]">{name}</p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--landing-text-muted)]">{detail}</p>
        </div>
        <p className="text-4xl font-semibold tracking-[-0.06em] text-[color:var(--landing-text)]">
          {price}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 text-sm text-[color:var(--landing-text-soft)]"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-[color:var(--landing-surface-strong)]">
              <span className="size-1.5 rounded-full bg-[color:var(--landing-accent)]" />
            </span>
            {feature}
          </div>
        ))}
      </div>

      <Link
        className={cn(
          "mt-8 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition",
          isPro
            ? "bg-[color:var(--landing-button-primary)] text-[color:var(--landing-button-primary-text)] hover:opacity-95"
            : "border border-[color:var(--landing-border)] bg-[color:var(--landing-button-secondary)] text-[color:var(--landing-text-soft)] hover:bg-[color:var(--landing-button-secondary-hover)] hover:text-[color:var(--landing-text)]",
        )}
        href="/signup"
      >
        {cta}
      </Link>
    </div>
  );
}

function ProgressBar({
  className,
  value,
}: {
  className?: string;
  value: string;
}) {
  return (
    <div className={cn("h-2 rounded-full bg-[color:var(--track-bg)]", className)}>
      <div
        className="h-2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--landing-progress-start), var(--landing-progress-end))",
          width: value,
        }}
      />
    </div>
  );
}

