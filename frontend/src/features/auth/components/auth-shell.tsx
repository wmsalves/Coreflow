"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import { ThemeToggle } from "@/features/landing/components/controls/theme-toggle";
import { LandingBackdrop } from "@/features/landing/components/landing-backdrop";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { landingThemeStyles } from "@/features/landing/lib/theme-styles";

type AuthShellProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

const proofPoints = [
  "Habits, focus, and training in one operating rhythm.",
  "A calmer dashboard for daily execution and review.",
  "Protected access with Supabase auth underneath.",
];

export function AuthShell({
  children,
  description,
  eyebrow,
  title,
}: AuthShellProps) {
  const { setTheme, theme } = useLandingPreferences();

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-(--landing-bg) text-(--landing-text)"
      data-theme={theme}
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />

      <div className="relative mx-auto min-h-screen w-full max-w-7xl px-5 pb-8 pt-5 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
        <div className="flex items-center justify-between gap-4">
          <CoreflowLogo
            frameClassName="border-(--landing-border) bg-(--landing-logo-frame)"
            nameClassName="text-(--landing-brand-text)"
            showTagline={false}
          />

          <ThemeToggle
            labels={{ dark: "Dark", label: "Theme", light: "Light" }}
            onThemeChange={setTheme}
            theme={theme}
          />
        </div>

        <div className="grid items-start gap-9 pt-10 sm:pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:pt-14 xl:pt-16">
          <section className="hidden lg:block">
            <Link
              className="inline-flex items-center gap-2 text-sm text-(--landing-text-muted) transition hover:text-(--landing-text)"
              href="/"
            >
              <ArrowLeft className="size-4" />
              Back to Coreflow
            </Link>

            <div className="mt-10 max-w-[34rem] space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--landing-text-faint)">
                {eyebrow}
              </p>
              <div className="space-y-5">
                <h1 className="text-[clamp(3.1rem,5.5vw,5.45rem)] leading-[0.92] font-semibold tracking-[-0.065em] text-(--landing-text)">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-8 text-(--landing-text-muted)">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-9 grid max-w-xl gap-3">
              {proofPoints.map((point) => (
                <div
                  className="landing-card-soft flex items-center gap-3 rounded-[1.35rem] border border-(--landing-border) bg-(--landing-surface) px-4 py-3 text-sm text-(--landing-text-soft) shadow-[var(--landing-shadow-soft)]"
                  key={point}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-(--landing-accent)" />
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-[31rem] flex-col justify-start lg:mx-0 lg:justify-self-end">
            <div className="mb-6 lg:hidden">
              <Link
                className="inline-flex items-center gap-2 text-sm text-(--landing-text-muted) transition hover:text-(--landing-text)"
                href="/"
              >
                <ArrowLeft className="size-4" />
                Back to Coreflow
              </Link>
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--landing-text-faint)">
                  {eyebrow}
                </p>
                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-(--landing-text)">
                  {title}
                </h1>
                <p className="text-sm leading-7 text-(--landing-text-muted)">
                  {description}
                </p>
              </div>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
