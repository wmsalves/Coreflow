import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoreflowLogo } from "@/components/brand/coreflow-logo";
import type { LandingCopy } from "@/features/landing/content/landing-copy";

type LandingFooterProps = {
  copy: LandingCopy["footer"];
};

export function LandingFooter({ copy }: LandingFooterProps) {
  return (
    <footer className="relative mt-8 border-t border-(--landing-border) py-14 sm:mt-12 sm:py-16 lg:py-18">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--landing-accent-ember),transparent)] opacity-70" />

      <div className="grid gap-12lg:gap-16">
        <div className="max-w-md space-y-5"></div>

        <nav
          aria-label="Footer"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
        >
          {copy.groups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-sm font-medium text-(--landing-text)">
                {group.title}
              </h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      className="group inline-flex items-center gap-1.5 text-sm text-(--landing-text-muted) transition hover:text-(--landing-text)"
                      href={link.href}
                    >
                      {link.label}
                      <span className="h-px w-0 bg-(--landing-accent) transition-all duration-200 group-hover:w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-12 border-t border-(--landing-border) pt-8 sm:mt-14 sm:pt-10">
        <div className="grid gap-6 rounded-[2rem] border border-(--landing-border) bg-[linear-gradient(180deg,var(--landing-surface-strong),var(--landing-surface))] p-5 shadow-[var(--landing-shadow-soft)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)] lg:items-center lg:p-6">
          <div className="max-w-xl space-y-2">
            <p className="text-lg font-medium tracking-[-0.03em] text-(--landing-text)">
              {copy.newsletter.title}
            </p>
            <p className="text-sm leading-6 text-(--landing-text-muted)">
              {copy.newsletter.description}
            </p>
          </div>

          <form className="space-y-2" action="#">
            <div className="flex flex-col gap-2 rounded-[1.35rem] border border-(--landing-border) bg-(--landing-bg-elevated) p-1.5 sm:flex-row">
              <label className="sr-only" htmlFor="footer-email">
                Email
              </label>
              <input
                className="min-h-11 flex-1 bg-transparent px-3 text-sm text-(--landing-text) outline-none placeholder:text-(--landing-text-faint)"
                id="footer-email"
                name="email"
                placeholder={copy.newsletter.placeholder}
                type="email"
              />
              <button
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-[1.05rem] bg-(--landing-button-primary) px-4 text-sm font-medium text-(--landing-button-primary-text) shadow-[var(--landing-button-shadow)] transition hover:shadow-[var(--landing-button-shadow-hover)]"
                type="submit"
              >
                {copy.newsletter.button}
                <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
            <p className="px-1 text-xs text-(--landing-text-faint)">
              {copy.newsletter.disclaimer}
            </p>
          </form>
        </div>
      </div>
    </footer>
  );
}
