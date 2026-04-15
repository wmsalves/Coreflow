import "server-only";
import { getHabitsOverview } from "@/features/habits/queries";
import { formatPercentage } from "@/lib/utils";

export async function getDashboardSnapshot(userId: string) {
  const habitsOverview = await getHabitsOverview(userId);

  return {
    metrics: [
      {
        label: "Habits completed today",
        value: `${habitsOverview.summary.completedTodayCount}/${habitsOverview.summary.activeCount || 0}`,
        detail: "Daily completions are powered by habit log entries for the current day.",
      },
      {
        label: "Daily completion rate",
        value: formatPercentage(habitsOverview.summary.completionRate),
        detail: "A quick signal for whether your day is keeping pace with your targets.",
      },
      {
        label: "Longest active streak",
        value: `${habitsOverview.summary.bestStreak}d`,
        detail: "Computed from consecutive completion dates so streaks survive refreshes and deploys.",
      },
      {
        label: "Modules in progress",
        value: "2",
        detail: "Study sessions and workouts are scaffolded in the schema and dashboard roadmap.",
      },
    ],
    recentHabits: habitsOverview.habits.slice(0, 3),
    nextSteps: [
      {
        title: "Study sessions",
        description: "Timer, history, and duration analytics can plug into the same authenticated app shell.",
      },
      {
        title: "Workout tracking",
        description: "Plans, exercises, and workout logs already have table definitions in the initial schema.",
      },
      {
        title: "Stripe plans",
        description: "The subscription table and env placeholders are ready for free-vs-pro gating next.",
      },
    ],
  };
}
