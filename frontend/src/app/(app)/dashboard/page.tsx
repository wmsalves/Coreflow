import { DashboardEntryTracker } from "@/components/analytics/dashboard-entry-tracker";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { requireUser } from "@/lib/auth";
import { getQueryParam } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const snapshot = await getDashboardSnapshot(user.id);
  const event = getQueryParam(params.event);

  return (
    <>
      <DashboardEntryTracker signupCompleted={event === "signup_completed"} />
      <DashboardOverview snapshot={snapshot} />
    </>
  );
}
