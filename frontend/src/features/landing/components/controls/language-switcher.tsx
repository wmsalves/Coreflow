"use client";

import type { LandingLocale } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  labels: {
    en: string;
    ptBR: string;
  };
  locale: LandingLocale;
  localeLabel: string;
  onLocaleChange: (locale: LandingLocale) => void;
};

export function LanguageSwitcher({
  labels,
  locale,
  localeLabel,
  onLocaleChange,
}: LanguageSwitcherProps) {
  return (
    <div
      aria-label={localeLabel}
      className="inline-flex items-center gap-1 text-xs"
      role="group"
    >
      <LocaleButton
        active={locale === "en"}
        label={labels.en}
        onClick={() => onLocaleChange("en")}
      />
      <span aria-hidden className="text-(--landing-text-faint)">
        /
      </span>
      <LocaleButton
        active={locale === "pt-BR"}
        label={labels.ptBR}
        onClick={() => onLocaleChange("pt-BR")}
      />
    </div>
  );
}

function LocaleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center text-[11px] font-medium tracking-[0.22em] uppercase",
        active
          ? "text-(--landing-text)"
          : "text-(--landing-text-faint) hover:text-(--landing-text-muted)",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
