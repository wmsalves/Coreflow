import "server-only";
import { getFitnessSnapshot } from "@/features/fitness/queries";
import { getFocusDashboardSnapshot } from "@/features/focus/queries";
import { getHabitsOverview } from "@/features/habits/queries";
import { formatPercentage } from "@/lib/utils";

export type DashboardMetricKey = "habitsToday" | "completionRate" | "longestStreak" | "modulesInProgress";
export type DashboardQuickActionKey =
  | "createHabit"
  | "planFocusSession"
  | "startFocus"
  | "openWorkoutBuilder";

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
  const pendingHabits = habitsOverview.habits.filter((habit) => !habit.completedToday);
  const overallProgress =
    habitsOverview.summary.activeCount === 0
      ? 0
      : habitsOverview.summary.completedTodayCount / habitsOverview.summary.activeCount;
  const hasActiveFocusSession = Boolean(focusSnapshot.activeSession);
  const hasActiveWorkout = Boolean(fitnessSnapshot.activeWorkoutProgress);

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
    todayView: {
      focusTimeTodaySeconds: focusSnapshot.todayFocusSeconds,
      modulesInProgressCount: modulesInProgress,
      overallProgress,
      habits: {
        completedCount: habitsOverview.summary.completedTodayCount,
        pendingCount: pendingHabits.length,
        pendingNames: pendingHabits.slice(0, 3).map((habit) => habit.name),
        totalCount: habitsOverview.summary.activeCount,
      },
      focus: {
        activeSessionTitle: focusSnapshot.activeSession?.title ?? null,
        completedSessions: focusSnapshot.completedSessions,
        hasActiveSession: hasActiveFocusSession,
        nextSessionDueDate: focusSnapshot.nextSession?.dueDate ?? null,
        nextSessionTitle: focusSnapshot.nextSession?.title ?? null,
        pendingSessions: focusSnapshot.pendingSessions,
        todayFocusSeconds: focusSnapshot.todayFocusSeconds,
        weekFocusSeconds: focusSnapshot.weekFocusSeconds,
      },
      fitness: {
        activeWorkoutName: fitnessSnapshot.activeWorkoutName,
        activeWorkoutProgress: fitnessSnapshot.activeWorkoutProgress,
        hasActiveWorkout,
        latestWorkoutProgress: fitnessSnapshot.latestWorkoutProgress,
        planCount: fitnessSnapshot.planCount,
      },
      quickActions: [
        {
          href: "/dashboard/habits",
          key: "createHabit" as const,
        },
        {
          href: "/dashboard/focus",
          key: "planFocusSession" as const,
        },
        {
          href: "/dashboard/focus",
          key: "startFocus" as const,
        },
        {
          href: "/dashboard/fitness",
          key: "openWorkoutBuilder" as const,
        },
      ],
    },
    moduleCards: [
      {
        href: "/dashboard/habits",
        key: "habits" as const,
      },
      {
        href: "/dashboard/focus",
        key: "focus" as const,
      },
      {
        href: "/dashboard/fitness",
        key: "fitness" as const,
      },
    ],
  };
}
