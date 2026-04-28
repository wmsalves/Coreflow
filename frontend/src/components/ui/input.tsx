import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-[1.15rem] border border-[var(--landing-border)] bg-[var(--landing-bg-elevated)] px-4 text-sm text-[var(--landing-text)] outline-none shadow-[var(--landing-chip-inset-shadow)]",
        "placeholder:text-[var(--landing-text-faint)] focus:border-[var(--focus-outline)] focus:ring-4 focus:ring-[var(--focus-ring)]",
        className,
      )}
      {...props}
    />
  );
}
