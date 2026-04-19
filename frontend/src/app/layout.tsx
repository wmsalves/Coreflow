import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://coreflow.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Coreflow",
  description: "A unified system for habits, study sessions, and fitness momentum.",
  openGraph: {
    title: "Coreflow",
    description: "One disciplined system for habits, focus, and training.",
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
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
