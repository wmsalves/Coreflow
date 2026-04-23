"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import { HeaderAccountActions } from "@/features/landing/components/header-account-actions";
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
  userEmail: string | null;
};

export function LandingHeader({
  controls,
  copy,
  locale,
  onLocaleChange,
  onThemeChange,
  scrolled,
  theme,
  userEmail,
}: LandingHeaderProps) {
  const accountCta = locale === "pt-BR" ? "Minha conta" : "Go to account";
  const accountCopy = {
    ...dashboardCopy[locale].header.userMenu,
    accountCta,
    dashboard: accountCta,
    signIn: copy.signIn,
    startFree: copy.cta,
  };

  return (
    <div className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <header
        className={cn(
          "relative mx-auto max-w-7xl overflow-visible rounded-[1.55rem] border px-4 py-3 backdrop-blur-2xl transition duration-300 sm:px-5 lg:px-6",
          scrolled
            ? "border-(--landing-border-strong) bg-(--landing-header) shadow-[var(--landing-header-shadow-scrolled)]"
            : "border-(--landing-border) bg-(--landing-header) shadow-[var(--landing-header-shadow)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.55rem] bg-[var(--landing-header-gloss)] opacity-90" />

        <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-2 lg:hidden">
          <CoreflowLogo
            className="gap-0 sm:gap-2.5"
            frameClassName="border-(--landing-border) bg-(--landing-logo-frame)"
            href="/"
            nameClassName="sr-only text-(--landing-text) sm:not-sr-only"
            showTagline={false}
          />

          <div className="min-w-0" />

          <div className="flex shrink-0 items-center justify-end gap-1">
            {userEmail ? (
              <HeaderAccountActions
                copy={accountCopy}
                menuContent={
                  <LandingMobileMenuControls
                    controls={controls}
                    locale={locale}
                    onLocaleChange={onLocaleChange}
                    onThemeChange={onThemeChange}
                    theme={theme}
                  />
                }
                userEmail={userEmail}
              />
            ) : (
              <>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--landing-button-primary)] px-3 text-[13px] font-medium text-[var(--landing-button-primary-text)] shadow-[var(--landing-button-shadow)] transition active:scale-[0.98] sm:px-4"
                  href="/signup"
                >
                  {copy.cta}
                </Link>
                <LandingMobileMenu
                  controls={controls}
                  copy={copy}
                  locale={locale}
                  onLocaleChange={onLocaleChange}
                  onThemeChange={onThemeChange}
                  theme={theme}
                />
              </>
            )}
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
            <HeaderAccountActions copy={accountCopy} userEmail={userEmail} />
          </div>
        </div>
      </header>
    </div>
  );
}

function LandingMobileMenu({
  controls,
  copy,
  locale,
  onLocaleChange,
  onThemeChange,
  theme,
}: {
  controls: LandingCopy["controls"];
  copy: LandingCopy["header"];
  locale: LandingLocale;
  onLocaleChange: (locale: LandingLocale) => void;
  onThemeChange: (theme: LandingTheme) => void;
  theme: LandingTheme;
}) {
  return (
    <details className="group relative z-50">
      <summary
        aria-label="Open menu"
        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full text-(--landing-text-faint) transition hover:bg-(--landing-surface) hover:text-(--landing-text) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-border-strong)] group-open:bg-(--landing-surface) group-open:text-(--landing-text) [&::-webkit-details-marker]:hidden"
      >
        <Menu className="size-4" />
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(15rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.15rem] border border-(--landing-border-strong) bg-(--landing-surface-alt) p-1.5 shadow-[var(--landing-shadow)]">
        <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-75" />
        <div className="pointer-events-none absolute right-4 top-[-5px] size-2.5 rotate-45 border-l border-t border-(--landing-border-strong) bg-(--landing-surface-alt)" />

        <div className="relative z-10 space-y-1 rounded-[0.9rem] px-2.5 py-2">
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-(--landing-text-muted)">
              {controls.localeLabel}
            </span>
            <LanguageSwitcher
              labels={controls.languages}
              locale={locale}
              localeLabel={controls.localeLabel}
              onLocaleChange={onLocaleChange}
            />
          </div>
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-(--landing-text-muted)">
              {controls.theme.label}
            </span>
            <ThemeToggle
              labels={controls.theme}
              onThemeChange={onThemeChange}
              theme={theme}
            />
          </div>
        </div>

        <div className="relative z-10 my-1 h-px bg-(--landing-border)" />

        <Link
          className="relative z-10 flex min-h-11 w-full items-center rounded-[0.85rem] px-2.5 py-2 text-[13px] font-medium text-(--landing-text-muted) transition hover:bg-(--landing-surface) hover:text-(--landing-text)"
          href="/login"
        >
          {copy.signIn}
        </Link>
      </div>
    </details>
  );
}

function LandingMobileMenuControls({
  controls,
  locale,
  onLocaleChange,
  onThemeChange,
  theme,
}: {
  controls: LandingCopy["controls"];
  locale: LandingLocale;
  onLocaleChange: (locale: LandingLocale) => void;
  onThemeChange: (theme: LandingTheme) => void;
  theme: LandingTheme;
}) {
  return (
    <div className="relative z-10 lg:hidden">
      <div className="my-1 h-px bg-[var(--landing-border)]" />
      <div className="space-y-1 rounded-[0.9rem] px-2.5 py-2">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-[var(--landing-text-muted)]">
            {controls.localeLabel}
          </span>
          <LanguageSwitcher
            labels={controls.languages}
            locale={locale}
            localeLabel={controls.localeLabel}
            onLocaleChange={onLocaleChange}
          />
        </div>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-[var(--landing-text-muted)]">
            {controls.theme.label}
          </span>
          <ThemeToggle
            labels={controls.theme}
            onThemeChange={onThemeChange}
            theme={theme}
          />
        </div>
      </div>
      <div className="my-1 h-px bg-[var(--landing-border)]" />
    </div>
  );
}
