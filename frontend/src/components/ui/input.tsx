import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 text-sm text-[var(--landing-text)] outline-none shadow-[var(--landing-chip-inset-shadow)]",
        "placeholder:text-[var(--landing-text-faint)] focus:border-[var(--landing-accent-strong)] focus:ring-4 focus:ring-[var(--landing-accent-soft)]",
        className,
      )}
      {...props}
    />
  );
}
