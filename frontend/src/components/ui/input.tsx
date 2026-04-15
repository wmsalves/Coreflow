import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 text-sm text-foreground outline-none",
        "placeholder:text-[var(--muted)] focus:border-[rgba(31,122,99,0.35)] focus:ring-4 focus:ring-[rgba(31,122,99,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
