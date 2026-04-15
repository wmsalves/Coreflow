"use client";

import Link from "next/link";
import { CoreflowLogo } from "@/components/marketing/coreflow-logo";
import type { LandingCopy, LandingLocale } from "@/components/marketing/landing-copy";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";
import { ThemeToggle, type LandingTheme } from "@/components/marketing/theme-toggle";

type LandingHeaderProps = {
  controls: LandingCopy["controls"];
  copy: LandingCopy["header"];
  locale: LandingLocale;
  onLocaleChange: (locale: LandingLocale) => void;
  onThemeChange: (theme: LandingTheme) => void;
  theme: LandingTheme;
};

export function LandingHeader({
  controls,
  copy,
  locale,
  onLocaleChange,
  onThemeChange,
  theme,
}: LandingHeaderProps) {
  return (
    <header className="sticky top-5 z-20 rounded-[1.65rem] border border-[color:var(--landing-border)] bg-[color:var(--landing-header)] px-4 py-3 shadow-[var(--landing-shadow)] backdrop-blur-xl sm:px-5 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
        <CoreflowLogo
          className="gap-2.5"
          frameClassName="border-[color:var(--landing-border)] bg-[color:var(--landing-logo-frame)]"
          href="/"
          nameClassName="text-[color:var(--landing-text)]"
          showTagline={false}
        />

        <div className="flex flex-wrap items-center justify-end gap-1.5">
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

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
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
                className="inline-flex h-9 items-center justify-center rounded-full px-3.5 text-[13px] text-[color:var(--landing-text-faint)] transition hover:bg-[color:var(--landing-surface)] hover:text-[color:var(--landing-text)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex min-w-0 items-center justify-self-end gap-1.5">
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
            className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--landing-button-primary)] px-4 text-[13px] font-medium text-[color:var(--landing-button-primary-text)] transition hover:opacity-95"
            href="/signup"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
