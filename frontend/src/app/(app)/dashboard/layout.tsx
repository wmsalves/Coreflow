import { AppShell } from "@/features/dashboard/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return <AppShell userEmail={user.email ?? "Signed in"}>{children}</AppShell>;
}
