import "server-only";
import { getHabitsOverview } from "@/features/habits/queries";
import { formatPercentage } from "@/lib/utils";

export type DashboardMetricKey = "habitsToday" | "completionRate" | "longestStreak" | "modulesInProgress";
export type DashboardNextStepKey = "studySessions" | "workoutTracking" | "stripePlans";

export async function getDashboardSnapshot(userId: string) {
  const habitsOverview = await getHabitsOverview(userId);

  return {
    metrics: [
      {
        key: "habitsToday" as const,
        value: `${habitsOverview.summary.completedTodayCount}/${habitsOverview.summary.activeCount || 0}`,
      },
      {
        key: "completionRate" as const,
        value: formatPercentage(habitsOverview.summary.completionRate),
      },
      {
        key: "longestStreak" as const,
        value: `${habitsOverview.summary.bestStreak}d`,
      },
      {
        key: "modulesInProgress" as const,
        value: "2",
      },
    ],
    recentHabits: habitsOverview.habits.slice(0, 3),
    nextSteps: [
      { key: "studySessions" as const },
      { key: "workoutTracking" as const },
      { key: "stripePlans" as const },
    ],
  };
}