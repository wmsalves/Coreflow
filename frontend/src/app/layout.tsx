import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coreflow",
  description: "A unified system for habits, study sessions, and fitness momentum.",
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
