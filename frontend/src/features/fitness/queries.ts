import "server-only";
import { listExerciseCatalog } from "@/features/fitness/catalog-api";
import type {
  WorkoutLog,
  WorkoutPlan,
  WorkoutPlanExercise,
  WorkoutSession,
} from "@/features/fitness/types";
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
type WorkoutSessionExerciseRow = Pick<
  Database["public"]["Tables"]["workout_session_exercises"]["Row"],
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
  | "reps"
  | "rest_seconds"
  | "sets"
  | "target"
  | "video_url"
  | "weight"
  | "workout_plan_exercise_id"
  | "workout_session_id"
>;
type WorkoutSessionRow = Pick<
  Database["public"]["Tables"]["workout_sessions"]["Row"],
  | "completed_at"
  | "id"
  | "started_at"
  | "status"
  | "updated_at"
  | "user_id"
  | "workout_log_id"
  | "workout_plan_id"
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
  const [activeSessionResult, exercisesResult, plansResult, logsResult] = await Promise.allSettled([
    getActiveWorkoutSessionForUser(userId),
    listExerciseCatalog(accessToken),
    getWorkoutPlansForUser(userId),
    getWorkoutLogsForUser(userId),
  ]);

  return {
    initialActiveSession:
      activeSessionResult.status === "fulfilled" ? activeSessionResult.value : null,
    initialExercises: exercisesResult.status === "fulfilled" ? exercisesResult.value : [],
    initialLoadFailed:
      activeSessionResult.status === "rejected" ||
      exercisesResult.status === "rejected" ||
      plansResult.status === "rejected" ||
      logsResult.status === "rejected",
    initialLogs: logsResult.status === "fulfilled" ? logsResult.value : [],
    initialPlans: plansResult.status === "fulfilled" ? plansResult.value : [],
  };
}

export async function getFitnessSnapshot(userId: string) {
  const [activeSessionResult, plansResult, logsResult] = await Promise.allSettled([
    getActiveWorkoutSessionForUser(userId),
    getWorkoutPlansForUser(userId),
    getWorkoutLogsForUser(userId),
  ]);

  const activeSession = activeSessionResult.status === "fulfilled" ? activeSessionResult.value : null;
  const logs = logsResult.status === "fulfilled" ? logsResult.value : [];
  const latestLog = logs[0] ?? null;
  const completedCount = latestLog
    ? latestLog.exercises.filter((exercise) => exercise.completed).length
    : 0;
  const totalCount = latestLog?.exercises.length ?? 0;
  const skippedCount = latestLog ? Math.max(totalCount - completedCount, 0) : 0;
  const activeCompletedCount = activeSession
    ? activeSession.exercises.filter((exercise) => exercise.completed).length
    : 0;
  const activeTotalCount = activeSession?.exercises.length ?? 0;

  return {
    activeWorkoutProgress:
      activeSession && activeTotalCount > 0
        ? {
            completedCount: activeCompletedCount,
            remainingCount: Math.max(activeTotalCount - activeCompletedCount, 0),
            totalCount: activeTotalCount,
          }
        : null,
    latestWorkoutProgress:
      latestLog && totalCount > 0
        ? {
            completedCount,
            logId: latestLog.id,
            remainingCount: Math.max(totalCount - completedCount, 0),
            skippedCount,
            totalCount,
            workoutName: latestLog.workoutName,
            completedAt: latestLog.completedAt,
          }
        : null,
    logCount: logs.length,
    planCount: plansResult.status === "fulfilled" ? plansResult.value.length : 0,
  };
}

export async function getActiveWorkoutSessionForUser(userId: string): Promise<WorkoutSession | null> {
  const supabase = await createServerSupabaseClient();
  const { data: session, error } = await supabase
    .from("workout_sessions")
    .select("completed_at, id, started_at, status, updated_at, user_id, workout_log_id, workout_plan_id")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) {
      return null;
    }

    throw new Error(error.message);
  }

  if (!session) {
    return null;
  }

  const sessionExercises = await getWorkoutSessionExercises(userId, [session.id]);
  return toWorkoutSession(session, sessionExercises.get(session.id) ?? []);
}

export async function getWorkoutSessionById(userId: string, sessionId: string): Promise<WorkoutSession> {
  const supabase = await createServerSupabaseClient();
  const { data: session, error } = await supabase
    .from("workout_sessions")
    .select("completed_at, id, started_at, status, updated_at, user_id, workout_log_id, workout_plan_id")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const sessionExercises = await getWorkoutSessionExercises(userId, [session.id]);
  return toWorkoutSession(session, sessionExercises.get(session.id) ?? []);
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

  const workoutNames = await getWorkoutPlanNames(
    userId,
    log.plan_id ? [log.plan_id] : [],
  );
  const logExercises = await getLogExercises(userId, [log.id]);
  return toWorkoutLog(
    log,
    logExercises.get(log.id) ?? [],
    workoutNames.get(log.plan_id ?? ""),
  );
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
  const workoutNames = await getWorkoutPlanNames(
    userId,
    logRows.flatMap((log) => (log.plan_id ? [log.plan_id] : [])),
  );
  const logExercises = await getLogExercises(
    userId,
    logRows.map((log) => log.id),
  );

  return logRows.map((log) =>
    toWorkoutLog(log, logExercises.get(log.id) ?? [], workoutNames.get(log.plan_id ?? "")),
  );
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

async function getWorkoutSessionExercises(userId: string, sessionIds: string[]) {
  if (sessionIds.length === 0) {
    return new Map<string, WorkoutSessionExerciseRow[]>();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workout_session_exercises")
    .select(
      "body_part, catalog_id, catalog_internal_id, completed, completed_at, equipment, gif_url, id, image_url, name, notes, order_index, reps, rest_seconds, sets, target, user_id, video_url, weight, workout_plan_exercise_id, workout_session_id",
    )
    .eq("user_id", userId)
    .in("workout_session_id", sessionIds)
    .order("order_index", { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map<string, WorkoutSessionExerciseRow[]>();
    }

    throw new Error(error.message);
  }

  return groupBy(
    (data ?? []) as WorkoutSessionExerciseRow[],
    (exercise) => exercise.workout_session_id,
  );
}

async function getWorkoutPlanNames(userId: string, planIds: string[]) {
  if (planIds.length === 0) {
    return new Map<string, string>();
  }

  const uniquePlanIds = [...new Set(planIds)];
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workout_plans")
    .select("id, name")
    .eq("user_id", userId)
    .in("id", uniquePlanIds);

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map<string, string>();
    }

    throw new Error(error.message);
  }

  return new Map((data ?? []).map((plan) => [plan.id, plan.name]));
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

function toWorkoutLog(
  log: WorkoutLogRow,
  exercises: WorkoutLogExerciseRow[],
  workoutName: string | undefined = undefined,
): WorkoutLog {
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
    workoutName: workoutName ?? null,
    workoutPlanId: log.plan_id,
  };
}

function toWorkoutSession(
  session: WorkoutSessionRow,
  exercises: WorkoutSessionExerciseRow[],
): WorkoutSession {
  return {
    completedAt: session.completed_at,
    exercises: exercises.map((exercise) => ({
      bodyPart: exercise.body_part,
      completed: exercise.completed,
      completedAt: exercise.completed_at,
      equipment: exercise.equipment,
      externalId: exercise.catalog_id,
      exerciseId: exercise.catalog_internal_id,
      gifUrl: exercise.gif_url,
      id: exercise.id,
      imageUrl: exercise.image_url,
      name: exercise.name,
      notes: exercise.notes,
      reps: exercise.reps,
      restSeconds: exercise.rest_seconds,
      sets: exercise.sets,
      sortOrder: exercise.order_index,
      target: exercise.target,
      videoUrl: exercise.video_url,
      weight: exercise.weight,
      workoutPlanExerciseId: exercise.workout_plan_exercise_id,
    })),
    id: session.id,
    startedAt: session.started_at,
    status: session.status as WorkoutSession["status"],
    updatedAt: session.updated_at,
    userId: session.user_id,
    workoutLogId: session.workout_log_id,
    workoutPlanId: session.workout_plan_id,
  };
}
