"use client";

import { LogIn, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import { signOutAction } from "@/features/auth/actions";
import { dashboardCopy } from "@/features/dashboard/content/dashboard-copy";
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
  const copy = dashboardCopy[locale].header;

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
            <DashboardLoginButton label={copy.userMenu.login} />
            {userEmail ? <UserMenu copy={copy.userMenu} userEmail={userEmail} /> : null}
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
            <DashboardLoginButton label={copy.userMenu.login} />
            {userEmail ? <UserMenu copy={copy.userMenu} userEmail={userEmail} /> : null}
          </div>
        </div>
      </header>
    </div>
  );
}

function DashboardLoginButton({ label }: { label: string }) {
  return (
    <Link
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[var(--landing-button-primary)] px-3 text-[13px] font-medium text-[var(--landing-button-primary-text)] shadow-[var(--landing-button-shadow)] transition hover:-translate-y-px hover:shadow-[var(--landing-button-shadow-hover)] sm:px-4"
      href="/login"
    >
      <LogIn className="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
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

function UserMenu({
  copy,
  userEmail,
}: {
  copy: {
    accountLabel: string;
    signedInAs: string;
    fallbackUser: string;
    signOut: string;
  };
  userEmail: string | null;
}) {
  const displayUser = userEmail ?? copy.fallbackUser;
  const initial = displayUser.trim().charAt(0).toUpperCase() || "C";

  return (
    <details className="group relative z-50">
      <summary
        aria-label={copy.accountLabel}
        className="flex size-9 cursor-pointer list-none items-center justify-center rounded-full text-[var(--landing-text-faint)] transition hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)] [&::-webkit-details-marker]:hidden"
      >
        <span className="flex size-7 items-center justify-center overflow-hidden rounded-full border border-[var(--landing-border)] bg-[var(--landing-logo-frame)] text-[11px] font-semibold text-[var(--landing-text-soft)] shadow-[var(--landing-chip-inset-shadow)]">
          {initial}
        </span>
      </summary>

      <div className="absolute right-0 top-11 z-50 w-[min(16rem,calc(100vw-2rem))] overflow-hidden rounded-[1.25rem] border border-[var(--landing-border)] bg-[var(--landing-panel)] p-2 shadow-[var(--landing-shadow)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-50" />
        <div className="relative z-10 flex items-center gap-3 border-b border-[var(--landing-border)] px-3 py-3">
          <UserCircle className="size-5 shrink-0 text-[var(--landing-text-muted)]" />
          <div className="min-w-0">
            <p className="text-xs text-[var(--landing-text-faint)]">{copy.signedInAs}</p>
            <p className="mt-0.5 truncate text-sm text-[var(--landing-text)]">{displayUser}</p>
          </div>
        </div>

        <form action={signOutAction} className="relative z-10">
          <button
            className="mt-1 flex w-full items-center gap-2 rounded-[0.9rem] px-3 py-2 text-left text-sm text-[var(--landing-text-muted)] transition hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]"
            type="submit"
          >
            <LogOut className="size-4" />
            {copy.signOut}
          </button>
        </form>
      </div>
    </details>
  );
}
