import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { requireAccessToken, requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const [user, accessToken] = await Promise.all([requireUser(), requireAccessToken()]);
  const snapshot = await getDashboardSnapshot(user.id, accessToken);

  return <DashboardOverview snapshot={snapshot} />;
}
