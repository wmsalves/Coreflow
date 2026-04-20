"use client";

import type { InputHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInAction, signUpAction } from "@/features/auth/actions";
import { authCopy, type AuthMode } from "@/features/auth/content/auth-copy";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { revealStyle } from "@/features/landing/lib/reveal";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  feedback?: {
    error?: string;
    message?: string;
  };
  mode: AuthMode;
};

export function AuthForm({ feedback, mode }: AuthFormProps) {
  const { locale } = useLandingPreferences();
  const isSignup = mode === "signup";
  const copy = authCopy[locale][mode];

  return (
    <div
      className="landing-card-strong landing-reveal rounded-[2.1rem] border border-(--landing-border) bg-[var(--landing-panel)] p-1 shadow-[var(--landing-shadow)]"
      style={revealStyle(120)}
    >
      <div className="relative overflow-hidden rounded-[calc(2.1rem-0.25rem)] border border-(--landing-border) bg-(--landing-surface) px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--landing-accent-ember),transparent)] opacity-80" />

        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--landing-text-faint)">
            {copy.formEyebrow}
          </p>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.045em] text-(--landing-text)">
              {copy.formTitle}
            </h2>
            <p className="text-sm leading-6 text-(--landing-text-muted)">
              {copy.formDescription}
            </p>
          </div>
        </div>

        {feedback?.error || feedback?.message ? (
          <div className="mt-5 space-y-3">
            {feedback.error ? (
              <p className="rounded-2xl border border-[rgba(204,90,67,0.22)] bg-[rgba(204,90,67,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
                {feedback.error}
              </p>
            ) : null}
            {feedback.message ? (
              <p className="rounded-2xl border border-[rgba(31,122,99,0.18)] bg-[rgba(31,122,99,0.08)] px-4 py-3 text-sm text-[var(--accent)]">
                {feedback.message}
              </p>
            ) : null}
          </div>
        ) : null}

        <form
          action={isSignup ? signUpAction : signInAction}
          className="mt-6 space-y-3.5"
        >
          {isSignup ? (
            <AuthField
              autoComplete="name"
              label={copy.fullNameLabel}
              name="fullName"
              placeholder={copy.fullNamePlaceholder}
              required
            />
          ) : null}

          <AuthField
            autoComplete="email"
            label={copy.emailLabel}
            name="email"
            placeholder={copy.emailPlaceholder}
            required
            type="email"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label
                className="text-sm font-medium text-(--landing-text-soft)"
                htmlFor="password"
              >
                {copy.passwordLabel}
              </label>
              {!isSignup && copy.forgotPassword ? (
                <Link
                  className="text-xs font-medium text-(--landing-text-faint) transition hover:text-(--landing-text)"
                  href="/signin#forgot-password"
                >
                  {copy.forgotPassword}
                </Link>
              ) : null}
            </div>
            <AuthInput
              autoComplete={isSignup ? "new-password" : "current-password"}
              id="password"
              minLength={isSignup ? 8 : 1}
              name="password"
              placeholder={
                isSignup
                  ? copy.newPasswordPlaceholder
                  : copy.currentPasswordPlaceholder
              }
              required
              type="password"
            />
          </div>

          {isSignup ? (
            <AuthField
              autoComplete="new-password"
              label={copy.confirmPasswordLabel}
              minLength={8}
              name="confirmPassword"
              placeholder={copy.confirmPasswordPlaceholder}
              required
              type="password"
            />
          ) : null}

          <SubmitButton
            className="group mt-2 h-12 w-full bg-(--landing-button-primary) text-sm font-medium text-(--landing-button-primary-text) shadow-[var(--landing-button-accent-shadow)] hover:bg-(--landing-button-primary) hover:shadow-[var(--landing-button-accent-shadow-hover)]"
            pendingLabel={copy.pending}
          >
            {copy.submit}
            <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
          </SubmitButton>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-[1.25rem] border border-(--landing-border) bg-(--landing-bg-elevated) px-4 py-3.5 text-sm">
          <p className="text-(--landing-text-muted)">{copy.alternateLabel}</p>
          <Link
            className="font-medium text-(--landing-text) transition hover:text-(--landing-accent)"
            href={copy.alternateHref}
          >
            {copy.alternateCta}
          </Link>
        </div>
      </div>
    </div>
  );
}

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

function AuthField({ label, ...props }: AuthFieldProps) {
  const id = props.id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-(--landing-text-soft)"
        htmlFor={id}
      >
        {label}
      </label>
      <AuthInput id={id} {...props} />
    </div>
  );
}

function AuthInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-(--landing-border) bg-(--landing-bg-elevated) px-4 text-sm text-(--landing-text) outline-none",
        "placeholder:text-(--landing-text-faint) focus:border-(--landing-border-strong) focus:ring-4 focus:ring-[var(--landing-accent-soft)]",
        className,
      )}
      {...props}
    />
  );
}


