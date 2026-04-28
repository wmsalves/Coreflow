import type { CSSProperties } from "react";

type PortalThemeStyle = CSSProperties & Record<`--${string}`, string>;

export function getPortalThemeBridge() {
  const themeRoot = document.querySelector<HTMLElement>("[data-theme]");

  if (!themeRoot) {
    return {};
  }

  const computedStyle = window.getComputedStyle(themeRoot);
  const style: PortalThemeStyle = {};

  for (const propertyName of Array.from(computedStyle)) {
    if (propertyName.startsWith("--")) {
      style[propertyName as `--${string}`] = computedStyle
        .getPropertyValue(propertyName)
        .trim();
    }
  }

  return {
    style,
    theme: themeRoot.dataset.theme,
  };
}
