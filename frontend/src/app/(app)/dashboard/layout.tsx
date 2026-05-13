import { AppShell } from "@/features/dashboard/components/app-shell";
import { requireUser } from "@/lib/auth";

function getDayPhase(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    }).format(now),
  );

  if (hour >= 5 && hour < 12) {
    return "morning" as const;
  }

  if (hour >= 12 && hour < 18) {
    return "midday" as const;
  }

  return "evening" as const;
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();
  const dayPhase = getDayPhase(new Date());

  return (
    <AppShell dayPhase={dayPhase} userEmail={user.email ?? null}>
      {children}
    </AppShell>
  );
}
