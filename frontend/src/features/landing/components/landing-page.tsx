"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { landingCopy } from "@/features/landing/content/landing-copy";
import { LandingBackdrop } from "@/features/landing/components/landing-backdrop";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { DailyFlowSection } from "@/features/landing/components/sections/daily-flow-section";
import { FinalCtaSection } from "@/features/landing/components/sections/final-cta-section";
import { HeroSection } from "@/features/landing/components/sections/hero-section";
import { PillarsSection } from "@/features/landing/components/sections/pillars-section";
import { PricingSection } from "@/features/landing/components/sections/pricing-section";
import { ProblemSection } from "@/features/landing/components/sections/problem-section";
import { ShowcaseSection } from "@/features/landing/components/sections/showcase-section";
import { SolutionSection } from "@/features/landing/components/sections/solution-section";
import { useLandingCardMotion } from "@/features/landing/hooks/use-landing-card-motion";
import { useLandingCursorLight } from "@/features/landing/hooks/use-landing-cursor-light";
import { useLandingHeaderScroll } from "@/features/landing/hooks/use-landing-header-scroll";
import { useLandingPreferences } from "@/features/landing/hooks/use-landing-preferences";
import { useLandingPreviewMotion } from "@/features/landing/hooks/use-landing-preview-motion";
import { useLandingReveal } from "@/features/landing/hooks/use-landing-reveal";
import { landingThemeStyles } from "@/features/landing/lib/theme-styles";

export function LandingPage() {
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
    maxWidth: locale === "pt-BR" ? "11.5ch" : "10ch",
  } satisfies CSSProperties;

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-x-hidden bg-(--landing-bg) text-(--landing-text)"
      data-theme={theme}
      style={landingThemeStyles[theme] as CSSProperties}
    >
      <LandingBackdrop theme={theme} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32">
        <LandingHeader
          controls={copy.controls}
          copy={copy.header}
          locale={locale}
          onLocaleChange={setLocale}
          onThemeChange={setTheme}
          scrolled={isScrolled}
          theme={theme}
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
      </div>
    </main>
  );
}
