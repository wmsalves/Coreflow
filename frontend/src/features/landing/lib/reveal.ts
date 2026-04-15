import type { CSSProperties } from "react";

export function revealStyle(delay: number): CSSProperties {
  return { transitionDelay: `${delay}ms` };
}
