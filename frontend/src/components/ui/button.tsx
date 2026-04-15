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
    "bg-[var(--foreground)] text-white shadow-[0_18px_32px_rgba(19,33,29,0.14)] hover:-translate-y-0.5 hover:bg-[#0f1b17]",
  secondary:
    "bg-white/80 text-foreground ring-1 ring-[var(--border)] hover:-translate-y-0.5 hover:bg-white",
  ghost: "bg-transparent text-[var(--muted)] hover:bg-[rgba(19,33,29,0.06)] hover:text-foreground",
  danger: "bg-[var(--danger)] text-white hover:bg-[#b74b36]",
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(31,122,99,0.24)]",
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
