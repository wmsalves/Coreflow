"use client";

import type { ReactNode } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

export type HeaderAccountCopy = {
  accountLabel: string;
  accountCta?: string;
  dashboard: string;
  fallbackUser: string;
  signIn: string;
  signedInAs: string;
  signOut: string;
  startFree: string;
};

type HeaderAccountActionsProps = {
  copy: HeaderAccountCopy;
  menuContent?: ReactNode;
  userEmail: string | null;
};

export function HeaderAccountActions({
  copy,
  menuContent,
  userEmail,
}: HeaderAccountActionsProps) {
  return (
    <div className="flex min-h-10 shrink-0 items-center justify-end gap-1 sm:min-h-9">
      {userEmail ? (
        <>
          {copy.accountCta ? (
            <Link
              className="hidden h-10 items-center justify-center rounded-full bg-[var(--landing-button-primary)] px-3 text-[13px] font-medium text-[var(--landing-button-primary-text)] shadow-[var(--landing-button-shadow)] transition hover:-translate-y-px hover:shadow-[var(--landing-button-shadow-hover)] sm:inline-flex sm:h-9 sm:px-4"
              href="/dashboard"
            >
              {copy.accountCta}
            </Link>
          ) : null}
          <UserMenu copy={copy} menuContent={menuContent} userEmail={userEmail} />
        </>
      ) : (
        <>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full px-3 text-[13px] font-medium text-[var(--landing-text-muted)] transition hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)] sm:h-9"
            href="/login"
          >
            {copy.signIn}
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--landing-button-primary)] px-3 text-[13px] font-medium text-[var(--landing-button-primary-text)] shadow-[var(--landing-button-shadow)] transition hover:-translate-y-px hover:shadow-[var(--landing-button-shadow-hover)] sm:h-9 sm:px-4"
            href="/signup"
          >
            {copy.startFree}
          </Link>
        </>
      )}
    </div>
  );
}

function UserMenu({
  copy,
  menuContent,
  userEmail,
}: {
  copy: HeaderAccountCopy;
  menuContent?: ReactNode;
  userEmail: string;
}) {
  const displayUser = userEmail || copy.fallbackUser;
  const initial = displayUser.trim().charAt(0).toUpperCase() || "C";

  return (
    <details className="group relative z-50">
      <summary
        aria-label={copy.accountLabel}
        className={cn(
          "flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-transparent text-[var(--landing-text-faint)] transition duration-200 sm:size-9",
          "hover:border-[var(--landing-border)] hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]",
          "group-open:border-[var(--landing-border-strong)] group-open:bg-[var(--landing-surface)] group-open:text-[var(--landing-text)]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--landing-border-strong)]",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-[var(--landing-border)] bg-[var(--landing-logo-frame)] text-[11px] font-semibold text-[var(--landing-text-soft)] shadow-[var(--landing-chip-inset-shadow)] transition group-open:border-[var(--landing-border-strong)] sm:size-7">
          {initial}
        </span>
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(14.75rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.15rem] border border-[var(--landing-border-strong)] bg-[var(--landing-surface-alt)] p-1.5 shadow-[var(--landing-shadow)]">
        <div className="pointer-events-none absolute inset-0 bg-[var(--landing-header-gloss)] opacity-75" />
        <div className="pointer-events-none absolute right-4 top-[-5px] size-2.5 rotate-45 border-l border-t border-[var(--landing-border-strong)] bg-[var(--landing-surface-alt)]" />

        <div className="relative z-10 flex items-center gap-2.5 rounded-[0.9rem] px-2.5 py-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-logo-frame)] text-[11px] font-semibold text-[var(--landing-text-soft)]">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] leading-4 text-[var(--landing-text-faint)]">
              {copy.signedInAs}
            </p>
            <p className="truncate text-[13px] font-medium leading-5 text-[var(--landing-text-soft)]">
              {displayUser}
            </p>
          </div>
        </div>

        <div className="relative z-10 my-1 h-px bg-[var(--landing-border)]" />

        <Link
          className="relative z-10 flex min-h-11 w-full items-center gap-2 rounded-[0.85rem] px-2.5 py-2 text-left text-[13px] font-medium text-[var(--landing-text-muted)] transition hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]"
          href="/dashboard"
        >
          <LayoutDashboard className="size-4 text-[var(--landing-text-faint)]" />
          {copy.dashboard}
        </Link>

        {menuContent}

        <form action={signOutAction} className="relative z-10">
          <button
            className="flex min-h-11 w-full items-center gap-2 rounded-[0.85rem] px-2.5 py-2 text-left text-[13px] font-medium text-[var(--landing-text-muted)] transition hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]"
            type="submit"
          >
            <LogOut className="size-4 text-[var(--landing-text-faint)]" />
            {copy.signOut}
          </button>
        </form>
      </div>
    </details>
  );
}
