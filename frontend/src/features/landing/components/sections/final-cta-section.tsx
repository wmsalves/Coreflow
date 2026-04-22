import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { SectionDivider, SectionLabel } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";

type FinalCtaSectionProps = {
  copy: LandingCopy["finalCta"];
};

export function FinalCtaSection({ copy }: FinalCtaSectionProps) {
  return (
    <section className="relative py-14 sm:py-22">
      <SectionDivider />
      <div className="landing-reveal" style={revealStyle(80)}>
        <div
          data-card-motion="panel"
          className="landing-card-strong overflow-hidden rounded-[1.6rem] border border-(--landing-border) bg-[var(--landing-panel)] px-5 py-8 shadow-[var(--landing-shadow)] sm:rounded-[2.5rem] sm:px-10 sm:py-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,var(--landing-glow),transparent_34%),radial-gradient(circle_at_86%_20%,var(--landing-cta-veil),transparent_22%)] opacity-70" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <SectionLabel>{copy.eyebrow}</SectionLabel>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-(--landing-text) sm:text-[2.7rem]">
                {copy.title}
              </h2>
              <p className="text-base leading-7 text-(--landing-text-muted)">
                {copy.body}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-(--landing-button-primary) px-5 text-sm font-medium text-(--landing-button-primary-text) shadow-[var(--landing-button-accent-shadow)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--landing-button-accent-shadow-hover)]"
                href="/signup"
              >
                {copy.primaryCta}
                <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-full border border-(--landing-border) bg-(--landing-button-secondary) px-5 text-sm font-medium text-(--landing-text-soft) transition duration-300 hover:-translate-y-0.5 hover:bg-(--landing-button-secondary-hover) hover:text-(--landing-text)"
                href="/login"
              >
                {copy.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
