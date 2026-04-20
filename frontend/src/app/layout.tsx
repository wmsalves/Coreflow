import type { Metadata } from "next";
import "./globals.css";

function withProtocol(url: string) {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

function getAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const vercelUrl = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)?.trim();
  const configuredIsLocal =
    configuredUrl?.includes("localhost") || configuredUrl?.includes("127.0.0.1");

  if (configuredUrl && !configuredIsLocal) {
    return withProtocol(configuredUrl);
  }

  if (vercelUrl) {
    return withProtocol(vercelUrl);
  }

  return "https://coreflow-wms.vercel.app";
}

const appUrl = getAppUrl();
const siteUrl = new URL(appUrl);
const brandAssets = {
  // Static public brand assets. Replace these files in frontend/public when final artwork changes.
  emailBanner: "/email/coreflow-banner.png",
  logo: "/logo.png",
  openGraph: "/og/coreflow.png",
} as const;
const logoUrl = new URL(brandAssets.logo, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Coreflow",
  description: "A unified system for habits, study sessions, and fitness momentum.",
  openGraph: {
    title: "Coreflow",
    description: "One disciplined system for habits, focus, and training.",
    url: "/",
    siteName: "Coreflow",
    type: "website",
    images: [
      {
        url: brandAssets.openGraph,
        width: 1200,
        height: 630,
        alt: "Coreflow - Habits, focus, and training in one system.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coreflow",
    description: "One disciplined system for habits, focus, and training.",
    images: [
      {
        url: brandAssets.openGraph,
        alt: "Coreflow - Habits, focus, and training in one system.",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta content={logoUrl} property="og:logo" />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
