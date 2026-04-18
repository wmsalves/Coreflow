import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--landing-button-primary)] text-[var(--landing-button-primary-text)] shadow-[var(--landing-button-shadow)] hover:-translate-y-0.5 hover:shadow-[var(--landing-button-shadow-hover)]",
  secondary:
    "border border-[var(--landing-border)] bg-[var(--landing-button-secondary)] text-[var(--landing-text-soft)] shadow-[var(--landing-shadow-soft)] hover:-translate-y-0.5 hover:border-[var(--landing-border-strong)] hover:bg-[var(--landing-button-secondary-hover)] hover:text-[var(--landing-text)]",
  ghost:
    "bg-transparent text-[var(--landing-text-muted)] hover:bg-[var(--landing-surface)] hover:text-[var(--landing-text)]",
  danger:
    "bg-[var(--danger)] text-[var(--danger-text)] shadow-[var(--landing-button-shadow)] hover:-translate-y-0.5 hover:brightness-95",
};

const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  asChild = false,
  children,
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-bg)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </Component>
  );
}
