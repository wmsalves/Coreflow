"use client";

import { MoonStar, SunMedium } from "lucide-react";
import type { LandingTheme } from "@/features/landing/types";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  labels: {
    dark: string;
    label: string;
    light: string;
  };
  onThemeChange: (theme: LandingTheme) => void;
  theme: LandingTheme;
};

export function ThemeToggle({
  labels,
  onThemeChange,
  theme,
}: ThemeToggleProps) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  const icon =
    theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />;
  const label = theme === "dark" ? labels.light : labels.dark;

  return (
    <button
      aria-label={`${labels.label}: ${label}`}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-transparent text-(--landing-text-faint) transition sm:size-9",
        "hover:border-[var(--landing-border)] hover:bg-(--landing-surface) hover:text-(--landing-text)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-bg)]",
      )}
      onClick={() => onThemeChange(nextTheme)}
      type="button"
    >
      {icon}
    </button>
  );
}
