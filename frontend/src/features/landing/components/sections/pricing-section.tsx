import type { CSSProperties } from "react";
import Link from "next/link";
import type { LandingCopy } from "@/features/landing/content/landing-copy";
import { SectionDivider, SectionIntro } from "@/features/landing/components/landing-primitives";
import { revealStyle } from "@/features/landing/lib/reveal";
import { cn } from "@/lib/utils";

type PricingSectionProps = {
  copy: LandingCopy["pricing"];
};

export function PricingSection({ copy }: PricingSectionProps) {
  return (
    <section className="relative py-22" id="pricing">
      <SectionDivider />
      <SectionIntro
        centered
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {copy.plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            highlight={plan.name === "Pro"}
            style={revealStyle(90 + index * 80)}
            {...plan}
          />
        ))}
      </div>
    </section>
  );
}

function PricingCard({
  cta,
  detail,
  features,
  highlight = false,
  name,
  price,
  style,
}: {
  cta: string;
  detail: string;
  features: string[];
  highlight?: boolean;
  name: string;
  price: string;
  style?: CSSProperties;
}) {
  return (
    <div className="landing-reveal h-full" style={style}>
      <div
        data-card-motion="follow"
        className={cn(
          "landing-card-strong relative h-full overflow-hidden rounded-[2.2rem] border p-6 shadow-[var(--landing-shadow-soft)]",
          highlight
            ? "border-(--landing-border-strong) bg-[var(--landing-panel)]"
            : "border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))]",
        )}
      >
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-(--landing-text)">{name}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-(--landing-text-muted)">
              {detail}
            </p>
          </div>
          <p className="text-4xl font-semibold tracking-[-0.06em] text-(--landing-text)">
            {price}
          </p>
        </div>

        <div className="relative mt-8 space-y-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-(--landing-text-soft)"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-(--landing-surface-strong)">
                <span className="size-1.5 rounded-full bg-(--landing-accent) shadow-[0_0_12px_var(--landing-glow)]" />
              </span>
              {feature}
            </div>
          ))}
        </div>

        <Link
          className={cn(
            "relative mt-8 inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition duration-300",
            highlight
              ? "bg-(--landing-button-primary) text-(--landing-button-primary-text) shadow-[var(--landing-button-accent-shadow)] hover:-translate-y-0.5 hover:shadow-[var(--landing-button-accent-shadow-hover)]"
              : "border border-(--landing-border) bg-(--landing-button-secondary) text-(--landing-text-soft) hover:-translate-y-0.5 hover:bg-(--landing-button-secondary-hover) hover:text-(--landing-text)",
          )}
          href="/signup"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
