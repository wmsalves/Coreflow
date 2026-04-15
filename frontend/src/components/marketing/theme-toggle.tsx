"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

export type LandingTheme = "dark" | "light";

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
  const icon = theme === "dark" ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />;
  const label = theme === "dark" ? labels.light : labels.dark;

  return (
    <button
      aria-label={`${labels.label}: ${label}`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-[color:var(--landing-text-faint)] transition",
        "hover:bg-[color:var(--landing-surface)] hover:text-[color:var(--landing-text)]",
      )}
      onClick={() => onThemeChange(nextTheme)}
      type="button"
    >
      {icon}
    </button>
  );
}
