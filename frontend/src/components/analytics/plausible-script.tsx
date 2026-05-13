import Script from "next/script";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
const plausibleScriptSource =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC?.trim() ?? "https://plausible.io/js/script.js";

export function PlausibleScript() {
  if (!plausibleDomain) {
    return null;
  }

  return (
    <Script
      data-domain={plausibleDomain}
      defer
      src={plausibleScriptSource}
      strategy="afterInteractive"
    />
  );
}
