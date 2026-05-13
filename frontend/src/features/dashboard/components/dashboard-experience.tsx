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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[24rem] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--landing-accent-soft)_20%,transparent),transparent_72%)] opacity-80" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[18rem] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--landing-bg-elevated)_82%,transparent))] opacity-80" />
      <DashboardHeader userEmail={userEmail} />
      {children}
    </div>
  );
}
