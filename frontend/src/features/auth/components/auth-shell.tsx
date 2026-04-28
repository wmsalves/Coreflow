"use client";

import type { CSSProperties, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { authCopy, type AuthMode } from "@/features/auth/content/auth-copy";
import { landingCopy } from "@/features/landing/content/landing-copy";
import { LandingBackdrop } from "@/features/landing/components/landing-backdrop";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { useLandingReveal } from "@/features/landing/hooks/use-landing-reveal";
import { revealStyle } from "@/features/landing/lib/reveal";
import { landingThemeStyles } from "@/features/landing/lib/theme-styles";

type AuthShellProps = {
  children: ReactNode;
  mode: AuthMode;
};

const proofPoints = {
  en: [
    "Habits, focus, and training in one operating rhythm.",
    "A calmer dashboard for daily execution and review.",
    "Protected access with Supabase auth underneath.",
  ],
  "pt-BR": [
    "Habitos, foco e treino em um unico ritmo operacional.",
    "Um dashboard mais calmo para execucao e revisao diaria.",
    "Acesso protegido com Supabase Auth por baixo.",
  ],
} as const;

export function AuthShell({ children, mode }: AuthShellProps) {
  const { locale, setLocale, setTheme, theme } = useLandingPreferences();
  useLandingReveal(locale, theme);

  const pageCopy = authCopy[locale][mode];
  const marketingCopy = landingCopy[locale];
  const headerCopy = {
    ...marketingCopy.header,
    nav: marketingCopy.header.nav.map((item) => ({
      ...item,
      href: item.href.startsWith("#") ? `/${item.href}` : item.href,
    })),
  };

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-(--landing-bg) text-(--landing-text)"
      data-theme={theme}
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop priority="compact" theme={theme} />
      <LandingHeader
        controls={marketingCopy.controls}
        copy={headerCopy}
        locale={locale}
        onLocaleChange={setLocale}
        onThemeChange={setTheme}
        scrolled={false}
        theme={theme}
        userEmail={null}
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-start gap-8 px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-36 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:pb-12 lg:pt-36 xl:pt-40">
        <section
          className="landing-reveal hidden lg:block"
          style={revealStyle(60)}
        >
          <div className="max-w-[34rem] space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--landing-text-faint)">
              {pageCopy.eyebrow}
            </p>
            <div className="space-y-5">
              <h1 className="text-[clamp(3.1rem,5.5vw,5.45rem)] leading-[0.92] font-semibold tracking-[-0.065em] text-(--landing-text)">
                {pageCopy.title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-(--landing-text-muted)">
                {pageCopy.description}
              </p>
            </div>
          </div>

          <div className="mt-9 grid max-w-xl gap-3">
            {proofPoints[locale].map((point) => (
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
          <div className="landing-reveal mb-6 lg:hidden" style={revealStyle(60)}>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--landing-text-faint)">
                {pageCopy.eyebrow}
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.055em] text-(--landing-text) sm:text-4xl">
                {pageCopy.title}
              </h1>
              <p className="text-sm leading-7 text-(--landing-text-muted)">
                {pageCopy.description}
              </p>
            </div>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}


