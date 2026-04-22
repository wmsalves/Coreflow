import type { DetailsHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DisclosureProps = DetailsHTMLAttributes<HTMLDetailsElement> & {
  children: ReactNode;
  summary: ReactNode;
};

export function Disclosure({
  children,
  className,
  summary,
  ...props
}: DisclosureProps) {
  return (
    <details
      className={cn(
        "group rounded-[1rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)]",
        className,
      )}
      {...props}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-[var(--landing-text-muted)] [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronDown className="size-4 shrink-0 text-[var(--landing-text-faint)] transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-[var(--landing-border)] px-3 py-3">
        {children}
      </div>
    </details>
  );
}
