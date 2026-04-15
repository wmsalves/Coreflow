"use client";

import Link from "next/link";
import { CoreflowLogo } from "@/components/marketing/coreflow-logo";
import type { LandingCopy, LandingLocale } from "@/components/marketing/landing-copy";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";
import { ThemeToggle, type LandingTheme } from "@/components/marketing/theme-toggle";
import { cn } from "@/lib/utils";

type LandingHeaderProps = {
  controls: LandingCopy["controls"];
  copy: LandingCopy["header"];
  locale: LandingLocale;
  onLocaleChange: (locale: LandingLocale) => void;
  onThemeChange: (theme: LandingTheme) => void;
  scrolled: boolean;
  theme: LandingTheme;
};

export function LandingHeader({
  controls,
  copy,
  locale,
  onLocaleChange,
  onThemeChange,
  scrolled,
  theme,
}: LandingHeaderProps) {
  return (
    <div className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <header
        className={cn(
          "relative mx-auto max-w-7xl overflow-hidden rounded-[1.55rem] border px-4 py-3 backdrop-blur-2xl transition duration-300 sm:px-5 lg:px-6",
          scrolled
            ? "border-[color:var(--landing-border-strong)] bg-[color:var(--landing-header)] shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
            : "border-[color:var(--landing-border)] bg-[color:var(--landing-header)] shadow-[0_12px_40px_rgba(0,0,0,0.14)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_60%)] opacity-70" />

        <div className="relative flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <CoreflowLogo
            className="gap-2.5"
            frameClassName="border-[color:var(--landing-border)] bg-[color:var(--landing-logo-frame)]"
            href="/"
            nameClassName="text-[color:var(--landing-text)]"
            showTagline={false}
          />

          <div className="flex flex-wrap items-center justify-end gap-1">
            <LanguageSwitcher
              labels={controls.languages}
              locale={locale}
              localeLabel={controls.localeLabel}
              onLocaleChange={onLocaleChange}
            />
            <ThemeToggle
              labels={controls.theme}
              onThemeChange={onThemeChange}
              theme={theme}
            />
          </div>
        </div>

        <div className="relative hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          <div className="min-w-0 justify-self-start">
            <CoreflowLogo
              className="gap-2.5"
              frameClassName="border-[color:var(--landing-border)] bg-[color:var(--landing-logo-frame)]"
              href="/"
              nameClassName="text-[color:var(--landing-text)]"
              showTagline={false}
            />
          </div>

          <nav className="justify-self-center">
            <div className="inline-flex items-center gap-0.5">
              {copy.nav.map((item) => (
                <Link
                  key={item.href}
                  className="inline-flex h-8 items-center justify-center rounded-full px-3 text-[12.5px] text-[color:var(--landing-text-faint)] transition hover:bg-[color:var(--landing-surface)] hover:text-[color:var(--landing-text)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex min-w-0 items-center justify-self-end gap-1">
            <LanguageSwitcher
              labels={controls.languages}
              locale={locale}
              localeLabel={controls.localeLabel}
              onLocaleChange={onLocaleChange}
            />
            <ThemeToggle
              labels={controls.theme}
              onThemeChange={onThemeChange}
              theme={theme}
            />
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--landing-button-primary)] px-4 text-[13px] font-medium text-[color:var(--landing-button-primary-text)] shadow-[0_10px_28px_rgba(0,0,0,0.14)] transition hover:-translate-y-px hover:shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
              href="/signup"
            >
              {copy.cta}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
