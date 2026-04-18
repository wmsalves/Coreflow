import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const snapshot = await getDashboardSnapshot(user.id);

  return <DashboardOverview snapshot={snapshot} />;
}