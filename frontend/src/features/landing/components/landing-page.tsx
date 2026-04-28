"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { landingCopy } from "@/features/landing/content/landing-copy";
import { LandingBackdrop } from "@/features/landing/components/landing-backdrop";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { HeroSection } from "@/features/landing/components/sections/hero-section";
import { useLandingCardMotion } from "@/features/landing/hooks/use-landing-card-motion";
import { useLandingCursorLight } from "@/features/landing/hooks/use-landing-cursor-light";
import { useLandingHeaderScroll } from "@/features/landing/hooks/use-landing-header-scroll";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { useLandingPreviewMotion } from "@/features/landing/hooks/use-landing-preview-motion";
import { useLandingReveal } from "@/features/landing/hooks/use-landing-reveal";
import { landingThemeStyles } from "@/features/landing/lib/theme-styles";

const ProblemSection = dynamic(() =>
  import("@/features/landing/components/sections/problem-section").then(
    (mod) => mod.ProblemSection,
  ),
);
const SolutionSection = dynamic(() =>
  import("@/features/landing/components/sections/solution-section").then(
    (mod) => mod.SolutionSection,
  ),
);
const PillarsSection = dynamic(() =>
  import("@/features/landing/components/sections/pillars-section").then(
    (mod) => mod.PillarsSection,
  ),
);
const DailyFlowSection = dynamic(() =>
  import("@/features/landing/components/sections/daily-flow-section").then(
    (mod) => mod.DailyFlowSection,
  ),
);
const ShowcaseSection = dynamic(() =>
  import("@/features/landing/components/sections/showcase-section").then(
    (mod) => mod.ShowcaseSection,
  ),
);
const PricingSection = dynamic(() =>
  import("@/features/landing/components/sections/pricing-section").then(
    (mod) => mod.PricingSection,
  ),
);
const FinalCtaSection = dynamic(() =>
  import("@/features/landing/components/sections/final-cta-section").then(
    (mod) => mod.FinalCtaSection,
  ),
);
const LandingFooter = dynamic(() =>
  import("@/features/landing/components/landing-footer").then(
    (mod) => mod.LandingFooter,
  ),
);

type LandingPageProps = {
  userEmail: string | null;
};

export function LandingPage({ userEmail }: LandingPageProps) {
  const { locale, setLocale, setTheme, theme } = useLandingPreferences();
  const isScrolled = useLandingHeaderScroll();
  const mainRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useLandingReveal(locale, theme);
  useLandingCursorLight(mainRef);
  useLandingCardMotion();
  useLandingPreviewMotion(previewRef);

  const copy = landingCopy[locale];
  const heroHeadlineStyle = {
    maxWidth: locale === "pt-BR" ? "12.5ch" : "12ch",
  } satisfies CSSProperties;

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-x-hidden bg-(--landing-bg) text-(--landing-text)"
      data-theme={theme}
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pt-32">
        <LandingHeader
          controls={copy.controls}
          copy={copy.header}
          locale={locale}
          onLocaleChange={setLocale}
          onThemeChange={setTheme}
          scrolled={isScrolled}
          theme={theme}
          userEmail={userEmail}
        />

        <HeroSection
          copy={copy}
          heroHeadlineStyle={heroHeadlineStyle}
          previewRef={previewRef}
        />
        <ProblemSection copy={copy.problem} />
        <SolutionSection copy={copy.solution} />
        <PillarsSection copy={copy.pillars} />
        <DailyFlowSection copy={copy.workflow} />
        <ShowcaseSection copy={copy.showcase} />
        <PricingSection copy={copy.pricing} />
        <FinalCtaSection copy={copy.finalCta} />
        <LandingFooter copy={copy.footer} />
      </div>
    </main>
  );
}
