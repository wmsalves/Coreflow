import "server-only";
import { getFitnessSnapshot } from "@/features/fitness/queries";
import { getStudySessionsOverview } from "@/features/focus/queries";
import { getHabitsOverview } from "@/features/habits/queries";
import { formatPercentage } from "@/lib/utils";

export type DashboardMetricKey = "habitsToday" | "completionRate" | "longestStreak" | "modulesInProgress";
export type DashboardNextStepKey = "studySessions" | "workoutTracking" | "stripePlans";

export async function getDashboardSnapshot(userId: string) {
  const [habitsOverview, studySessions, fitnessSnapshot] = await Promise.all([
    getHabitsOverview(userId),
    getStudySessionsOverview(userId),
    getFitnessSnapshot(userId),
  ]);

  const modulesInProgress = [
    habitsOverview.summary.activeCount > 0,
    studySessions.length > 0,
    fitnessSnapshot.planCount > 0 || fitnessSnapshot.logCount > 0,
  ].filter(Boolean).length;

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
        value: `${modulesInProgress}/3`,
      },
    ],
    recentHabits: habitsOverview.habits.slice(0, 3),
    nextSteps: [
      { href: "/dashboard/focus", key: "studySessions" as const },
      {
        href: "/dashboard/fitness",
        key: "workoutTracking" as const,
        active: Boolean(fitnessSnapshot.activeWorkoutProgress),
        progress: fitnessSnapshot.latestWorkoutProgress,
        sessionProgress: fitnessSnapshot.activeWorkoutProgress,
      },
      { href: "/dashboard", key: "stripePlans" as const },
    ],
  };
}
