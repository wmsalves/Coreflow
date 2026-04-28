"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  LayoutDashboard,
  ListChecks,
  TimerReset,
} from "lucide-react";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import { HeaderAccountActions } from "@/features/landing/components/header-account-actions";
import { LanguageSwitcher } from "@/features/landing/components/controls/language-switcher";
import { ThemeToggle } from "@/features/landing/components/controls/theme-toggle";
import { landingCopy } from "@/features/landing/content/landing-copy";
import { useLandingHeaderScroll } from "@/features/landing/hooks/use-landing-header-scroll";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

type DashboardNavKey = "fitness" | "focus" | "habits" | "overview";

const navItems: Array<{
  href: string;
  icon: ComponentType<{ className?: string }>;
  key: DashboardNavKey;
}> = [
  { href: "/dashboard", icon: LayoutDashboard, key: "overview" },
  { href: "/dashboard/habits", icon: ListChecks, key: "habits" },
  { href: "/dashboard/focus", icon: TimerReset, key: "focus" },
  { href: "/dashboard/fitness", icon: Dumbbell, key: "fitness" },
];

type DashboardHeaderProps = {
  userEmail: string | null;
};

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale, setTheme, theme } = useLandingPreferences();
  const scrolled = useLandingHeaderScroll(8);
  const landingControls = landingCopy[locale].controls;
  const landingHeader = landingCopy[locale].header;
  const copy = dashboardCopy[locale].header;
  const currentNavItem =
    [...navItems]
      .sort((first, second) => second.href.length - first.href.length)
      .find((item) =>
        item.href === "/dashboard"
          ? pathname === item.href
          : pathname.startsWith(item.href),
      ) ?? navItems[0];
  const accountCopy = {
    ...copy.userMenu,
    dashboard: copy.navLabel,
    signIn: landingHeader.signIn,
    startFree: landingHeader.cta,
  };

  return (
    <div className="fixed inset-x-0 top-[calc(0.75rem+env(safe-area-inset-top))] z-40 px-3 sm:top-4 sm:px-4">
      <header
        className={cn(
          "relative mx-auto max-w-7xl overflow-visible rounded-[1.55rem] border px-4 py-3 backdrop-blur-2xl transition duration-300 sm:px-5 lg:px-6",
          scrolled
            ? "border-[var(--landing-border-strong)] bg-[var(--landing-header)] shadow-[var(--landing-header-shadow-scrolled)]"
            : "border-[var(--landing-border)] bg-[var(--landing-header)] shadow-[var(--landing-header-shadow)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.55rem] bg-[var(--landing-header-gloss)] opacity-90" />

        <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:hidden">
          <CoreflowLogo
            className="gap-0 sm:gap-2.5"
            frameClassName="border-[var(--landing-border)] bg-[var(--landing-logo-frame)]"
            href="/dashboard"
            nameClassName="sr-only text-[var(--landing-text)] sm:not-sr-only"
            showTagline={false}
          />
          <span className="min-w-0 justify-self-start truncate px-1 text-sm font-semibold tracking-[-0.02em] text-[var(--landing-text)]">
            {copy.nav[currentNavItem.key]}
          </span>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-1">
            <HeaderAccountActions
              copy={accountCopy}
              menuContent={
                <DashboardMobileMenuControls
                  landingControls={landingControls}
                  locale={locale}
                  setLocale={setLocale}
                  setTheme={setTheme}
                  theme={theme}
                />
              }
              userEmail={userEmail}
            />
          </div>
        </div>

        <div className="relative hidden lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          <div className="min-w-0 justify-self-start">
            <CoreflowLogo
              className="gap-2.5"
              frameClassName="border-[var(--landing-border)] bg-[var(--landing-logo-frame)]"
              href="/dashboard"
              nameClassName="text-[var(--landing-text)]"
              showTagline={false}
            />
          </div>

          <nav aria-label={copy.navLabel} className="justify-self-center">
            <div className="inline-flex items-center gap-0.5">
              {navItems.map((item) => (
                <DashboardNavLink
                  active={isNavItemActive(pathname, item.href)}
                  href={item.href}
                  key={item.href}
                  label={copy.nav[item.key]}
                />
              ))}
            </div>
          </nav>

          <div className="flex min-w-0 items-center justify-self-end gap-1">
            <LanguageSwitcher
              labels={landingControls.languages}
              locale={locale}
              localeLabel={landingControls.localeLabel}
              onLocaleChange={setLocale}
            />
            <ThemeToggle labels={landingControls.theme} onThemeChange={setTheme} theme={theme} />
            <HeaderAccountActions copy={accountCopy} userEmail={userEmail} />
          </div>
        </div>
      </header>

      <nav
        aria-label={copy.navLabel}
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 rounded-[1.45rem] border border-[var(--landing-border-strong)] bg-[var(--landing-header)] p-1.5 shadow-[var(--landing-header-shadow-scrolled)] backdrop-blur-2xl lg:hidden"
      >
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <DashboardNavLink
              active={isNavItemActive(pathname, item.href)}
              href={item.href}
              icon={item.icon}
              key={item.href}
              label={copy.nav[item.key]}
              mobile
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function DashboardNavLink({
  active,
  href,
  icon: Icon,
  label,
  mobile = false,
}: {
  active: boolean;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  label: string;
  mobile?: boolean;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        mobile
          ? "inline-flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-1 text-[11px] font-medium transition active:scale-[0.98]"
          : "inline-flex h-8 items-center justify-center rounded-full px-3 text-[12.5px] transition",
        active
          ? mobile
            ? "bg-[var(--landing-accent-soft)] text-[var(--landing-text)] shadow-[var(--landing-chip-inset-shadow)]"
            : "bg-[var(--landing-surface)] text-[var(--landing-text)] shadow-[var(--landing-chip-inset-shadow)]"
          : "text-[var(--landing-text-faint)] hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]",
      )}
      href={href}
    >
      {mobile && Icon ? (
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full border transition",
            active
              ? "border-[var(--landing-accent-strong)] bg-[var(--landing-surface-strong)] text-[var(--landing-accent)]"
              : "border-transparent text-[var(--landing-text-faint)]",
          )}
        >
          <Icon className="size-4" />
        </span>
      ) : null}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function DashboardMobileMenuControls({
  landingControls,
  locale,
  setLocale,
  setTheme,
  theme,
}: {
  landingControls: typeof landingCopy.en.controls;
  locale: keyof typeof landingCopy;
  setLocale: (locale: keyof typeof landingCopy) => void;
  setTheme: (theme: "dark" | "light") => void;
  theme: "dark" | "light";
}) {
  return (
    <div className="relative z-10">
      <div className="my-1 h-px bg-[var(--landing-border)]" />
      <div className="space-y-1 rounded-[0.9rem] px-2.5 py-2">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-[var(--landing-text-muted)]">
            {landingControls.localeLabel}
          </span>
          <LanguageSwitcher
            labels={landingControls.languages}
            locale={locale}
            localeLabel={landingControls.localeLabel}
            onLocaleChange={setLocale}
          />
        </div>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span className="text-[13px] font-medium text-[var(--landing-text-muted)]">
            {landingControls.theme.label}
          </span>
          <ThemeToggle labels={landingControls.theme} onThemeChange={setTheme} theme={theme} />
        </div>
      </div>
      <div className="my-1 h-px bg-[var(--landing-border)]" />
    </div>
  );
}

function isNavItemActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}
