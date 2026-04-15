import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

type CoreflowLogoProps = {
  className?: string;
  frameClassName?: string;
  href?: string;
  nameClassName?: string;
  showTagline?: boolean;
  tagline?: string;
  taglineClassName?: string;
};

export function CoreflowLogo({
  className,
  frameClassName,
  href = "/",
  nameClassName,
  showTagline = true,
  tagline = BRAND.tagline,
  taglineClassName,
}: CoreflowLogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-(--landing-border) bg-(--landing-surface)",
          frameClassName,
        )}
      >
        <Image
          alt={BRAND.logoAlt}
          className="object-cover"
          height={40}
          priority
          src={BRAND.logoPath}
          width={40}
        />
      </span>

      <span className="min-w-0">
        <span
          className={cn(
            "block text-sm font-semibold tracking-[0.18em] uppercase text-(--landing-text)",
            nameClassName,
          )}
        >
          {BRAND.name}
        </span>

        {showTagline ? (
          <span
            className={cn(
              "block text-xs text-(--landing-text-faint)",
              taglineClassName,
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
