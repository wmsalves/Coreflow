import "server-only";
import { getFitnessSnapshot } from "@/features/fitness/queries";
import { getFocusDashboardSnapshot } from "@/features/focus/queries";
import { getHabitsOverview } from "@/features/habits/queries";
import { formatPercentage } from "@/lib/utils";

export type DashboardMetricKey = "habitsToday" | "completionRate" | "longestStreak" | "modulesInProgress";
export type DashboardNextStepKey = "studySessions" | "workoutTracking" | "stripePlans";

export async function getDashboardSnapshot(userId: string) {
  const [habitsOverview, focusSnapshot, fitnessSnapshot] = await Promise.all([
    getHabitsOverview(userId),
    getFocusDashboardSnapshot(userId),
    getFitnessSnapshot(userId),
  ]);

  const modulesInProgress = [
    habitsOverview.summary.activeCount > 0,
    focusSnapshot.completedSessions > 0 ||
      focusSnapshot.pendingSessions > 0 ||
      Boolean(focusSnapshot.activeSession),
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
      {
        href: "/dashboard/focus",
        key: "studySessions" as const,
        focus: {
          activeSessionTitle: focusSnapshot.activeSession?.title ?? null,
          completedSessions: focusSnapshot.completedSessions,
          pendingSessions: focusSnapshot.pendingSessions,
          todayFocusSeconds: focusSnapshot.todayFocusSeconds,
          weekFocusSeconds: focusSnapshot.weekFocusSeconds,
        },
      },
      {
        href:
          fitnessSnapshot.activeWorkoutProgress
            ? "/dashboard/fitness"
            : fitnessSnapshot.latestWorkoutProgress?.logId
              ? `/dashboard/fitness/history/${fitnessSnapshot.latestWorkoutProgress.logId}`
              : "/dashboard/fitness",
        key: "workoutTracking" as const,
        active: Boolean(fitnessSnapshot.activeWorkoutProgress),
        progress: fitnessSnapshot.latestWorkoutProgress,
        sessionProgress: fitnessSnapshot.activeWorkoutProgress,
      },
      { href: "/dashboard", key: "stripePlans" as const },
    ],
  };
}
