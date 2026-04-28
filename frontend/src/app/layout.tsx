import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa/pwa-register";
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
  applicationName: "Coreflow",
  title: "Coreflow",
  description: "A unified system for habits, study sessions, and fitness momentum.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coreflow",
  },
  icons: {
    apple: [
      {
        sizes: "180x180",
        type: "image/png",
        url: "/apple-touch-icon.png",
      },
    ],
    icon: [
      {
        sizes: "192x192",
        type: "image/png",
        url: "/icon-192.png",
      },
      {
        sizes: "512x512",
        type: "image/png",
        url: "/icon-512.png",
      },
    ],
  },
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
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#080a0f" },
  ],
  viewportFit: "cover",
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
        <link href="/manifest.webmanifest" rel="manifest" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
