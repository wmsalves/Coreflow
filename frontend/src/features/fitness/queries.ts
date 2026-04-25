import "server-only";
import { listExerciseCatalog } from "@/features/fitness/catalog-api";
import type { WorkoutLog, WorkoutPlan, WorkoutPlanExercise } from "@/features/fitness/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type PlanExerciseRow = Pick<
  Database["public"]["Tables"]["exercises"]["Row"],
  | "body_part"
  | "catalog_id"
  | "catalog_internal_id"
  | "equipment"
  | "gif_url"
  | "id"
  | "image_url"
  | "name"
  | "notes"
  | "order_index"
  | "plan_id"
  | "reps"
  | "rest_seconds"
  | "sets"
  | "target"
  | "video_url"
>;
type WorkoutLogExerciseRow = Pick<
  Database["public"]["Tables"]["workout_log_exercises"]["Row"],
  | "body_part"
  | "catalog_id"
  | "catalog_internal_id"
  | "completed"
  | "completed_at"
  | "equipment"
  | "gif_url"
  | "id"
  | "image_url"
  | "name"
  | "notes"
  | "order_index"
  | "reps_completed"
  | "rest_seconds"
  | "sets_completed"
  | "target"
  | "video_url"
  | "weight"
  | "workout_log_id"
>;
type WorkoutLogRow = Pick<
  Database["public"]["Tables"]["workout_logs"]["Row"],
  "duration_minutes" | "id" | "notes" | "performed_at" | "plan_id" | "user_id"
>;
type WorkoutPlanRow = Pick<
  Database["public"]["Tables"]["workout_plans"]["Row"],
  "created_at" | "description" | "id" | "name" | "updated_at" | "user_id"
>;

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
    error.message?.includes("Could not find the") ||
    error.message?.includes("schema cache")
  );
}

function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K) {
  const grouped = new Map<K, T[]>();

  for (const item of items) {
    const key = getKey(item);
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  }

  return grouped;
}

export async function getFitnessWorkspaceData(userId: string, accessToken: string) {
  const [exercisesResult, plansResult, logsResult] = await Promise.allSettled([
    listExerciseCatalog(accessToken),
    getWorkoutPlansForUser(userId),
    getWorkoutLogsForUser(userId),
  ]);

  return {
    initialExercises: exercisesResult.status === "fulfilled" ? exercisesResult.value : [],
    initialLoadFailed:
      exercisesResult.status === "rejected" ||
      plansResult.status === "rejected" ||
      logsResult.status === "rejected",
    initialLogs: logsResult.status === "fulfilled" ? logsResult.value : [],
    initialPlans: plansResult.status === "fulfilled" ? plansResult.value : [],
  };
}

export async function getFitnessSnapshot(userId: string) {
  const [plansResult, logsResult] = await Promise.allSettled([
    getWorkoutPlansForUser(userId),
    getWorkoutLogsForUser(userId),
  ]);

  const logs = logsResult.status === "fulfilled" ? logsResult.value : [];
  const latestLog = logs[0] ?? null;
  const completedCount = latestLog
    ? latestLog.exercises.filter((exercise) => exercise.completed).length
    : 0;
  const totalCount = latestLog?.exercises.length ?? 0;

  return {
    latestWorkoutProgress:
      latestLog && totalCount > 0
        ? {
            completedCount,
            remainingCount: Math.max(totalCount - completedCount, 0),
            totalCount,
          }
        : null,
    logCount: logs.length,
    planCount: plansResult.status === "fulfilled" ? plansResult.value.length : 0,
  };
}

export async function getWorkoutPlanById(userId: string, planId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: plan, error } = await supabase
    .from("workout_plans")
    .select("created_at, description, id, name, updated_at, user_id")
    .eq("id", planId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const exercises = await getPlanExercises(userId, [plan.id]);
  return toWorkoutPlan(plan, exercises.get(plan.id) ?? []);
}

export async function getWorkoutLogById(userId: string, logId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: log, error } = await supabase
    .from("workout_logs")
    .select("duration_minutes, id, notes, performed_at, plan_id, user_id")
    .eq("id", logId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const logExercises = await getLogExercises(userId, [log.id]);
  return toWorkoutLog(log, logExercises.get(log.id) ?? []);
}

async function getWorkoutPlansForUser(userId: string): Promise<WorkoutPlan[]> {
  const supabase = await createServerSupabaseClient();
  const { data: plans, error } = await supabase
    .from("workout_plans")
    .select("created_at, description, id, name, updated_at, user_id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }

    throw new Error(error.message);
  }

  const planRows = plans ?? [];
  const exercises = await getPlanExercises(
    userId,
    planRows.map((plan) => plan.id),
  );

  return planRows.map((plan) => toWorkoutPlan(plan, exercises.get(plan.id) ?? []));
}

async function getWorkoutLogsForUser(userId: string): Promise<WorkoutLog[]> {
  const supabase = await createServerSupabaseClient();
  const { data: logs, error } = await supabase
    .from("workout_logs")
    .select("duration_minutes, id, notes, performed_at, plan_id, user_id")
    .eq("user_id", userId)
    .order("performed_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }

    throw new Error(error.message);
  }

  const logRows = logs ?? [];
  const logExercises = await getLogExercises(
    userId,
    logRows.map((log) => log.id),
  );

  return logRows.map((log) => toWorkoutLog(log, logExercises.get(log.id) ?? []));
}

async function getPlanExercises(userId: string, planIds: string[]) {
  if (planIds.length === 0) {
    return new Map<string, PlanExerciseRow[]>();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      "body_part, catalog_id, catalog_internal_id, equipment, gif_url, id, image_url, name, notes, order_index, plan_id, reps, rest_seconds, sets, target, user_id, video_url, weight",
    )
    .eq("user_id", userId)
    .in("plan_id", planIds)
    .order("order_index", { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map<string, PlanExerciseRow[]>();
    }

    throw new Error(error.message);
  }

  return groupBy((data ?? []) as PlanExerciseRow[], (exercise) => exercise.plan_id);
}

async function getLogExercises(userId: string, logIds: string[]) {
  if (logIds.length === 0) {
    return new Map<string, WorkoutLogExerciseRow[]>();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workout_log_exercises")
    .select(
      "body_part, catalog_id, catalog_internal_id, completed, completed_at, equipment, gif_url, id, image_url, name, notes, order_index, reps_completed, rest_seconds, sets_completed, target, user_id, video_url, weight, workout_log_id",
    )
    .eq("user_id", userId)
    .in("workout_log_id", logIds)
    .order("order_index", { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map<string, WorkoutLogExerciseRow[]>();
    }

    throw new Error(error.message);
  }

  return groupBy((data ?? []) as WorkoutLogExerciseRow[], (exercise) => exercise.workout_log_id);
}

function toWorkoutPlan(plan: WorkoutPlanRow, exercises: PlanExerciseRow[]): WorkoutPlan {
  return {
    createdAt: plan.created_at,
    description: plan.description,
    exercises: exercises.map(toWorkoutPlanExercise),
    id: plan.id,
    name: plan.name,
    updatedAt: plan.updated_at,
    userId: plan.user_id,
  };
}

function toWorkoutPlanExercise(exercise: PlanExerciseRow): WorkoutPlanExercise {
  return {
    durationSeconds: null,
    exercise: {
      bodyPart: exercise.body_part,
      category: null,
      equipment: exercise.equipment,
      externalId: exercise.catalog_id,
      gifUrl: exercise.gif_url,
      id: exercise.catalog_internal_id,
      imageUrl: exercise.image_url,
      instructions: [],
      name: exercise.name,
      secondaryMuscles: [],
      source: exercise.catalog_id ? "catalog" : null,
      target: exercise.target,
      targetMuscle: exercise.target,
      videoUrl: exercise.video_url,
    },
    exerciseId: exercise.catalog_internal_id,
    id: exercise.id,
    notes: exercise.notes,
    reps: exercise.reps,
    restSeconds: exercise.rest_seconds,
    sets: exercise.sets,
    sortOrder: exercise.order_index,
  };
}

function toWorkoutLog(log: WorkoutLogRow, exercises: WorkoutLogExerciseRow[]): WorkoutLog {
  return {
    completedAt: log.performed_at,
    durationMinutes: log.duration_minutes,
    exercises: exercises.map((exercise) => ({
      bodyPart: exercise.body_part,
      completed: exercise.completed,
      completedAt: exercise.completed_at,
      equipment: exercise.equipment,
      externalId: exercise.catalog_id,
      exerciseId: exercise.catalog_internal_id,
      gifUrl: exercise.gif_url,
      imageUrl: exercise.image_url,
      name: exercise.name,
      notes: exercise.notes,
      repsCompleted: exercise.reps_completed,
      restSeconds: exercise.rest_seconds,
      setsCompleted: exercise.sets_completed,
      sortOrder: exercise.order_index,
      target: exercise.target,
      videoUrl: exercise.video_url,
      weight: exercise.weight,
    })),
    id: log.id,
    notes: log.notes,
    userId: log.user_id,
    workoutPlanId: log.plan_id,
  };
}
