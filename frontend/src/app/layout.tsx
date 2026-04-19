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

  return configuredUrl ?? "http://localhost:3000";
}

const appUrl = getAppUrl();
const siteUrl = new URL(appUrl);
const logoUrl = new URL("/favicon.ico", siteUrl).toString();

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Coreflow",
    description: "One disciplined system for habits, focus, and training.",
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
