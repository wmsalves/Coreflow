"use server";

import { revalidatePath } from "next/cache";
import {
  getExerciseCatalogDetail,
  listExerciseCatalog,
  searchExerciseCatalog,
} from "@/features/fitness/catalog-api";
import {
  getActiveWorkoutSessionForUser,
  getWorkoutLogById,
  getWorkoutPlanById,
  getWorkoutSessionById,
} from "@/features/fitness/queries";
import type {
  ExerciseConfig,
  ExerciseDetail,
  WorkoutLog,
  WorkoutPlan,
  WorkoutSession,
} from "@/features/fitness/types";
import { requireAccessToken, requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const maxNameLength = 120;
const maxDescriptionLength = 1000;
const maxNotesLength = 1000;

function revalidateFitnessViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/fitness");
}

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function clampNullableWeight(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.min(5000, Math.max(0, value));
  return Math.round(normalized * 100) / 100;
}

function optionalText(value: string | undefined, maxLength: number) {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }

  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
}

function requireText(value: string, fieldName: string, maxLength: number) {
  const normalized = optionalText(value, maxLength);
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

async function createWorkoutLogWithExercises(input: {
  planId: string;
  sourceExercises: Array<{
    bodyPart: string | null;
    completed: boolean;
    completedAt: string | null;
    equipment: string | null;
    exerciseId: number | null;
    externalId: string | null;
    gifUrl: string | null;
    imageUrl: string | null;
    name: string;
    notes: string | null;
    reps: number | null;
    restSeconds: number | null;
    sets: number | null;
    sortOrder: number | null;
    target: string | null;
    videoUrl: string | null;
    weight?: number | null;
  }>;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  userId: string;
}) {
  const { data: log, error: logError } = await input.supabase
    .from("workout_logs")
    .insert({
      plan_id: input.planId,
      user_id: input.userId,
    })
    .select("id")
    .single();

  if (logError) {
    throw new Error(logError.message);
  }

  const { error: exercisesError } = await input.supabase
    .from("workout_log_exercises")
    .insert(
      input.sourceExercises.map((exercise, index) => ({
        body_part: exercise.bodyPart,
        catalog_id: exercise.externalId,
        catalog_internal_id: exercise.exerciseId,
        completed: exercise.completed,
        completed_at: exercise.completed
          ? exercise.completedAt ?? new Date().toISOString()
          : null,
        equipment: exercise.equipment,
        gif_url: exercise.gifUrl,
        image_url: exercise.imageUrl,
        name: exercise.name,
        notes: exercise.notes,
        order_index: exercise.sortOrder ?? index + 1,
        reps_completed: exercise.reps,
        rest_seconds: exercise.restSeconds,
        sets_completed: exercise.sets,
        target: exercise.target,
        user_id: input.userId,
        video_url: exercise.videoUrl,
        weight: exercise.weight ?? null,
        workout_log_id: log.id,
      })),
    );

  if (exercisesError) {
    await input.supabase
      .from("workout_logs")
      .delete()
      .eq("id", log.id)
      .eq("user_id", input.userId);

    throw new Error(exercisesError.message);
  }

  return log.id;
}

export async function listExerciseCatalogAction() {
  const accessToken = await requireAccessToken();
  return listExerciseCatalog(accessToken);
}

export async function searchExerciseCatalogAction(query: string) {
  const accessToken = await requireAccessToken();
  const normalizedQuery = query.trim();
  return normalizedQuery
    ? searchExerciseCatalog(normalizedQuery, accessToken)
    : listExerciseCatalog(accessToken);
}

export async function getExerciseDetailAction(id: string) {
  const accessToken = await requireAccessToken();
  return getExerciseCatalogDetail(id, accessToken);
}

export async function createWorkoutPlanAction(input: {
  description?: string;
  name: string;
}): Promise<WorkoutPlan> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("workout_plans")
    .insert({
      description: optionalText(input.description, maxDescriptionLength),
      name: requireText(input.name, "Workout plan name", maxNameLength),
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateFitnessViews();
  return getWorkoutPlanById(user.id, data.id);
}

export async function addExerciseToWorkoutPlanAction(
  planId: string,
  exercise: ExerciseDetail,
  config: ExerciseConfig,
  sortOrder: number,
): Promise<WorkoutPlan> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data: plan, error: planError } = await supabase
    .from("workout_plans")
    .select("id")
    .eq("id", planId)
    .eq("user_id", user.id)
    .single();

  if (planError) {
    throw new Error(planError.message);
  }

  const { error } = await supabase.from("exercises").insert({
    body_part: optionalText(exercise.bodyPart ?? undefined, maxNameLength),
    catalog_id: optionalText(exercise.id, maxNameLength),
    catalog_internal_id: exercise.internalId,
    equipment: optionalText(exercise.equipment ?? undefined, maxNameLength),
    gif_url: optionalText(exercise.gifUrl ?? undefined, 2048),
    image_url: optionalText(exercise.imageUrl ?? undefined, 2048),
    name: requireText(exercise.name, "Exercise name", maxNameLength),
    notes: optionalText(config.notes, maxNotesLength),
    order_index: clampInteger(sortOrder, 0, 1000),
    plan_id: plan.id,
    reps: clampInteger(config.reps, 1, 1000),
    rest_seconds: clampInteger(config.restSeconds, 0, 86400),
    sets: clampInteger(config.sets, 1, 100),
    target: optionalText(exercise.target ?? undefined, maxNameLength),
    user_id: user.id,
    video_url: optionalText(exercise.videoUrl ?? undefined, 2048),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidateFitnessViews();
  return getWorkoutPlanById(user.id, plan.id);
}

export async function removeExerciseFromWorkoutPlanAction(
  planId: string,
  exerciseId: string,
): Promise<WorkoutPlan> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data: exercise, error: exerciseError } = await supabase
    .from("exercises")
    .select("id, plan_id")
    .eq("id", exerciseId)
    .eq("plan_id", planId)
    .eq("user_id", user.id)
    .single();

  if (exerciseError) {
    throw new Error(exerciseError.message);
  }

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exercise.id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateFitnessViews();
  return getWorkoutPlanById(user.id, exercise.plan_id);
}

export async function startWorkoutSessionAction(planId: string): Promise<WorkoutSession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const existingSession = await getActiveWorkoutSessionForUser(user.id);

  if (existingSession) {
    return existingSession;
  }

  const plan = await getWorkoutPlanById(user.id, planId);

  if (plan.exercises.length === 0) {
    throw new Error("Add at least one exercise before starting this workout.");
  }

  const now = new Date().toISOString();
  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      started_at: now,
      updated_at: now,
      user_id: user.id,
      workout_plan_id: plan.id,
    })
    .select("id")
    .single();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error: exercisesError } = await supabase
    .from("workout_session_exercises")
    .insert(
      plan.exercises.map((exercise, index) => ({
        body_part: exercise.exercise.bodyPart,
        catalog_id: exercise.exercise.externalId,
        catalog_internal_id: exercise.exerciseId,
        completed: false,
        completed_at: null,
        equipment: exercise.exercise.equipment,
        gif_url: exercise.exercise.gifUrl,
        image_url: exercise.exercise.imageUrl,
        name: exercise.exercise.name,
        notes: exercise.notes,
        order_index: exercise.sortOrder ?? index + 1,
        reps: exercise.reps,
        rest_seconds: exercise.restSeconds,
        sets: exercise.sets,
        target: exercise.exercise.target,
        updated_at: now,
        user_id: user.id,
        video_url: exercise.exercise.videoUrl,
        workout_plan_exercise_id: exercise.id,
        workout_session_id: session.id,
      })),
    );

  if (exercisesError) {
    await supabase
      .from("workout_sessions")
      .delete()
      .eq("id", session.id)
      .eq("user_id", user.id);

    throw new Error(exercisesError.message);
  }

  revalidateFitnessViews();
  return getWorkoutSessionById(user.id, session.id);
}

export async function updateWorkoutSessionExerciseCompletionAction(input: {
  completed: boolean;
  sessionExerciseId: string;
  sessionId: string;
}): Promise<WorkoutSession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const session = await getWorkoutSessionById(user.id, input.sessionId);

  if (session.status !== "in_progress") {
    throw new Error("Only in-progress workouts can be updated.");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("workout_session_exercises")
    .update({
      completed: input.completed,
      completed_at: input.completed ? now : null,
      updated_at: now,
    })
    .eq("id", input.sessionExerciseId)
    .eq("workout_session_id", input.sessionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const { error: sessionError } = await supabase
    .from("workout_sessions")
    .update({ updated_at: now })
    .eq("id", input.sessionId)
    .eq("user_id", user.id);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  revalidateFitnessViews();
  return getWorkoutSessionById(user.id, input.sessionId);
}

export async function updateWorkoutSessionExerciseDetailsAction(input: {
  reps: number;
  restSeconds: number;
  sessionExerciseId: string;
  sessionId: string;
  sets: number;
  weight: number | null;
}): Promise<WorkoutSession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const session = await getWorkoutSessionById(user.id, input.sessionId);

  if (session.status !== "in_progress") {
    throw new Error("Only in-progress workouts can be updated.");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("workout_session_exercises")
    .update({
      reps: clampInteger(input.reps, 1, 1000),
      rest_seconds: clampInteger(input.restSeconds, 0, 86400),
      sets: clampInteger(input.sets, 1, 100),
      updated_at: now,
      weight: clampNullableWeight(input.weight),
    })
    .eq("id", input.sessionExerciseId)
    .eq("workout_session_id", input.sessionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const { error: sessionError } = await supabase
    .from("workout_sessions")
    .update({ updated_at: now })
    .eq("id", input.sessionId)
    .eq("user_id", user.id);

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  revalidateFitnessViews();
  return getWorkoutSessionById(user.id, input.sessionId);
}

export async function cancelWorkoutSessionAction(sessionId: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const session = await getWorkoutSessionById(user.id, sessionId);

  if (session.status !== "in_progress") {
    return;
  }

  const { error } = await supabase
    .from("workout_sessions")
    .update({
      completed_at: null,
      status: "cancelled",
      updated_at: new Date().toISOString(),
      workout_log_id: null,
    })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateFitnessViews();
}

export async function finishWorkoutSessionAction(sessionId: string): Promise<WorkoutLog> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const session = await getWorkoutSessionById(user.id, sessionId);

  if (session.status !== "in_progress") {
    throw new Error("This workout session is no longer active.");
  }

  if (session.exercises.length === 0) {
    throw new Error("Add at least one exercise before finishing this workout.");
  }

  const logId = await createWorkoutLogWithExercises({
    planId: session.workoutPlanId,
    sourceExercises: session.exercises.map((exercise) => ({
      bodyPart: exercise.bodyPart,
      completed: exercise.completed,
      completedAt: exercise.completedAt,
      equipment: exercise.equipment,
      exerciseId: exercise.exerciseId,
      externalId: exercise.externalId,
      gifUrl: exercise.gifUrl,
      imageUrl: exercise.imageUrl,
      name: exercise.name,
      notes: exercise.notes,
      reps: exercise.reps,
      restSeconds: exercise.restSeconds,
      sets: exercise.sets,
      sortOrder: exercise.sortOrder,
      target: exercise.target,
      videoUrl: exercise.videoUrl,
      weight: exercise.weight,
    })),
    supabase,
    userId: user.id,
  });

  const completedAt = new Date().toISOString();
  const { error: sessionError } = await supabase
    .from("workout_sessions")
    .update({
      completed_at: completedAt,
      status: "completed",
      updated_at: completedAt,
      workout_log_id: logId,
    })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (sessionError) {
    await supabase
      .from("workout_logs")
      .delete()
      .eq("id", logId)
      .eq("user_id", user.id);

    throw new Error(sessionError.message);
  }

  revalidateFitnessViews();
  return getWorkoutLogById(user.id, logId);
}

export async function logWorkoutAction(planId: string): Promise<WorkoutLog> {
  return logWorkoutExecutionAction(
    planId,
    [],
  );
}

export async function logWorkoutExecutionAction(
  planId: string,
  exerciseCompletion: Array<{ completed: boolean; exerciseId: string }>,
): Promise<WorkoutLog> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const plan = await getWorkoutPlanById(user.id, planId);

  if (plan.exercises.length === 0) {
    throw new Error("Add at least one exercise before logging this workout.");
  }

  const completionMap = new Map(
    exerciseCompletion.map((item) => [item.exerciseId, item.completed]),
  );
  const logId = await createWorkoutLogWithExercises({
    planId: plan.id,
    sourceExercises: plan.exercises.map((exercise) => ({
      bodyPart: exercise.exercise.bodyPart,
      completed: completionMap.get(exercise.id) ?? false,
      completedAt: completionMap.get(exercise.id) ? new Date().toISOString() : null,
      equipment: exercise.exercise.equipment,
      exerciseId: exercise.exerciseId,
      externalId: exercise.exercise.externalId,
      gifUrl: exercise.exercise.gifUrl,
      imageUrl: exercise.exercise.imageUrl,
      name: exercise.exercise.name,
      notes: exercise.notes,
      reps: exercise.reps,
      restSeconds: exercise.restSeconds,
      sets: exercise.sets,
      sortOrder: exercise.sortOrder,
      target: exercise.exercise.target,
      videoUrl: exercise.exercise.videoUrl,
    })),
    supabase,
    userId: user.id,
  });

  revalidateFitnessViews();
  return getWorkoutLogById(user.id, logId);
}
