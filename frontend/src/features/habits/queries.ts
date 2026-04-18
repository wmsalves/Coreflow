import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

export type HabitOverviewItem = {
  completedToday: boolean;
  completionsThisWeek: number;
  currentStreak: number;
  description: string | null;
  frequencyPerWeek: number;
  id: string;
  name: string;
};

export type HabitsOverview = {
  habits: HabitOverviewItem[];
  summary: {
    activeCount: number;
    bestStreak: number;
    completedTodayCount: number;
    completionRate: number;
  };
};

const emptyHabitsOverview: HabitsOverview = {
  habits: [],
  summary: {
    activeCount: 0,
    bestStreak: 0,
    completedTodayCount: 0,
    completionRate: 0,
  },
};

type SupabaseQueryError = {
  code?: string;
  message?: string;
};

function isMissingSchemaError(error: SupabaseQueryError | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST205" ||
    error.code === "PGRST204" ||
    error.message?.includes("Could not find the table") ||
    error.message?.includes("schema cache")
  );
}

function addDays(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function getCurrentStreak(logDates: Set<string>, today: string) {
  let streak = 0;
  let cursor = today;

  // Walk backward one day at a time so streaks remain deterministic from persisted logs.
  while (logDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function groupLogsByHabit(logs: Pick<HabitLogRow, "completed_on" | "habit_id">[]) {
  const grouped = new Map<string, Set<string>>();

  for (const log of logs) {
    const logSet = grouped.get(log.habit_id) ?? new Set<string>();
    logSet.add(log.completed_on);
    grouped.set(log.habit_id, logSet);
  }

  return grouped;
}

export async function getHabitsOverview(userId: string): Promise<HabitsOverview> {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = addDays(today, -6);
  const historyStart = addDays(today, -60);

  const [habitsResult, logsResult] = await Promise.all([
    supabase
      .from("habits")
      .select("id, name, description, frequency_per_week, created_at")
      .eq("user_id", userId)
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("habit_logs")
      .select("habit_id, completed_on")
      .eq("user_id", userId)
      .gte("completed_on", historyStart)
      .order("completed_on", { ascending: false }),
  ]);

  if (habitsResult.error) {
    if (isMissingSchemaError(habitsResult.error)) {
      return emptyHabitsOverview;
    }

    throw new Error(habitsResult.error.message);
  }

  if (logsResult.error) {
    if (isMissingSchemaError(logsResult.error)) {
      return emptyHabitsOverview;
    }

    throw new Error(logsResult.error.message);
  }

  const logMap = groupLogsByHabit(logsResult.data ?? []);
  const habits = ((habitsResult.data ?? []) as Pick<
    HabitRow,
    "description" | "frequency_per_week" | "id" | "name"
  >[]).map((habit) => {
    const logDates = logMap.get(habit.id) ?? new Set<string>();
    const completionsThisWeek = Array.from(logDates).filter((value) => value >= weekStart).length;

    return {
      completedToday: logDates.has(today),
      completionsThisWeek,
      currentStreak: getCurrentStreak(logDates, today),
      description: habit.description,
      frequencyPerWeek: habit.frequency_per_week,
      id: habit.id,
      name: habit.name,
    };
  });

  const activeCount = habits.length;
  const completedTodayCount = habits.filter((habit) => habit.completedToday).length;
  const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.currentStreak), 0);

  return {
    habits,
    summary: {
      activeCount,
      bestStreak,
      completedTodayCount,
      completionRate: activeCount === 0 ? 0 : completedTodayCount / activeCount,
    },
  };
}
