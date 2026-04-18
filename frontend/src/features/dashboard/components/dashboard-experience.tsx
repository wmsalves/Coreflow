"use client";

import type { CSSProperties, ReactNode } from "react";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { LandingBackdrop } from "@/features/landing/components/landing-backdrop";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { landingThemeStyles } from "@/features/landing/lib/theme-styles";

type DashboardExperienceProps = {
  children: ReactNode;
  userEmail: string | null;
};

export function DashboardExperience({ children, userEmail }: DashboardExperienceProps) {
  const { theme } = useLandingPreferences();

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-text)]"
      data-theme={theme}
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />
      <DashboardHeader userEmail={userEmail} />
      {children}
    </div>
  );
}