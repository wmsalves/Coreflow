"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
import { HeaderAccountActions } from "@/features/landing/components/header-account-actions";
import { LanguageSwitcher } from "@/features/landing/components/controls/language-switcher";
import { ThemeToggle } from "@/features/landing/components/controls/theme-toggle";
import { landingCopy } from "@/features/landing/content/landing-copy";
import { useLandingHeaderScroll } from "@/features/landing/hooks/use-landing-header-scroll";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { cn } from "@/lib/utils";

const navItems: Array<{ href: string; key: "overview" | "focus" | "habits" | "fitness" }> = [
  { href: "/dashboard", key: "overview" },
  { href: "/dashboard/focus", key: "focus" },
  { href: "/dashboard/habits", key: "habits" },
  { href: "/dashboard/fitness", key: "fitness" },
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
  const accountCopy = {
    ...copy.userMenu,
    dashboard: copy.navLabel,
    signIn: landingHeader.signIn,
    startFree: landingHeader.cta,
  };

  return (
    <div className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <header
        className={cn(
          "relative mx-auto max-w-7xl overflow-visible rounded-[1.55rem] border px-4 py-3 backdrop-blur-2xl transition duration-300 sm:px-5 lg:px-6",
          scrolled
            ? "border-[var(--landing-border-strong)] bg-[var(--landing-header)] shadow-[var(--landing-header-shadow-scrolled)]"
            : "border-[var(--landing-border)] bg-[var(--landing-header)] shadow-[var(--landing-header-shadow)]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.55rem] bg-[var(--landing-header-gloss)] opacity-90" />

        <div className="relative flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <CoreflowLogo
            className="gap-2.5"
            frameClassName="border-[var(--landing-border)] bg-[var(--landing-logo-frame)]"
            href="/dashboard"
            nameClassName="text-[var(--landing-text)]"
            showTagline={false}
          />

          <div className="flex min-w-0 items-center justify-end gap-1">
            <LanguageSwitcher
              labels={landingControls.languages}
              locale={locale}
              localeLabel={landingControls.localeLabel}
              onLocaleChange={setLocale}
            />
            <ThemeToggle labels={landingControls.theme} onThemeChange={setTheme} theme={theme} />
            <HeaderAccountActions copy={accountCopy} userEmail={userEmail} />
          </div>

          <nav aria-label={copy.navLabel} className="w-full overflow-x-auto">
            <div className="inline-flex min-w-max items-center gap-0.5">
              {navItems.map((item) => (
                <DashboardNavLink
                  active={pathname === item.href}
                  href={item.href}
                  key={item.href}
                  label={copy.nav[item.key]}
                />
              ))}
            </div>
          </nav>
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
                  active={pathname === item.href}
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
    </div>
  );
}

function DashboardNavLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-full px-3 text-[12.5px] transition",
        active
          ? "text-[var(--landing-text)]"
          : "text-[var(--landing-text-faint)] hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]",
      )}
      href={href}
    >
      {label}
    </Link>
  );
}
