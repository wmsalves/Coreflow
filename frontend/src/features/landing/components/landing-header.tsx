"use client";

import Link from "next/link";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { LanguageSwitcher } from "@/features/landing/components/controls/language-switcher";
import { ThemeToggle } from "@/features/landing/components/controls/theme-toggle";
import type { LandingLocale, LandingTheme } from "@/features/landing/types";
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
            ? "border-(--landing-border-strong) bg-(--landing-header) shadow-[var(--landing-header-shadow-scrolled)]"
            : "border-(--landing-border) bg-(--landing-header) shadow-[var(--landing-header-shadow)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-90" />

        <div className="relative flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <CoreflowLogo
            className="gap-2.5"
            frameClassName="border-(--landing-border) bg-(--landing-logo-frame)"
            href="/"
            nameClassName="text-(--landing-text)"
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
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full px-3 text-[13px] font-medium text-(--landing-text-muted) transition hover:bg-(--landing-surface) hover:text-(--landing-text)"
              href="/login"
            >
              {copy.signIn}
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          <div className="min-w-0 justify-self-start">
            <CoreflowLogo
              className="gap-2.5"
              frameClassName="border-(--landing-border) bg-(--landing-logo-frame)"
              href="/"
              nameClassName="text-(--landing-text)"
              showTagline={false}
            />
          </div>

          <nav className="justify-self-center">
            <div className="inline-flex items-center gap-0.5">
              {copy.nav.map((item) => (
                <Link
                  key={item.href}
                  className="inline-flex h-8 items-center justify-center rounded-full px-3 text-[12.5px] text-(--landing-text-faint) transition hover:bg-(--landing-surface) hover:text-(--landing-text)"
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
              className="inline-flex h-9 items-center justify-center rounded-full px-3 text-[13px] font-medium text-(--landing-text-muted) transition hover:bg-(--landing-surface) hover:text-(--landing-text)"
              href="/login"
            >
              {copy.signIn}
            </Link>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-full bg-(--landing-button-primary) px-4 text-[13px] font-medium text-(--landing-button-primary-text) shadow-[var(--landing-button-shadow)] transition hover:-translate-y-px hover:shadow-[var(--landing-button-shadow-hover)]"
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
