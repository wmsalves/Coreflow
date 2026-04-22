"use server";

import { revalidatePath } from "next/cache";
import {
  getExerciseCatalogDetail,
  listExerciseCatalog,
  searchExerciseCatalog,
} from "@/features/fitness/catalog-api";
import { getWorkoutLogById, getWorkoutPlanById } from "@/features/fitness/queries";
import type { ExerciseConfig, ExerciseDetail, WorkoutLog, WorkoutPlan } from "@/features/fitness/types";
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

export async function logWorkoutAction(planId: string): Promise<WorkoutLog> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const plan = await getWorkoutPlanById(user.id, planId);

  if (plan.exercises.length === 0) {
    throw new Error("Add at least one exercise before logging this workout.");
  }

  const { data: log, error: logError } = await supabase
    .from("workout_logs")
    .insert({
      plan_id: plan.id,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (logError) {
    throw new Error(logError.message);
  }

  const { error: exercisesError } = await supabase.from("workout_log_exercises").insert(
    plan.exercises.map((exercise, index) => ({
      catalog_internal_id: exercise.exerciseId,
      name: exercise.exercise.name,
      notes: exercise.notes,
      order_index: exercise.sortOrder ?? index + 1,
      reps_completed: exercise.reps,
      sets_completed: exercise.sets,
      user_id: user.id,
      workout_log_id: log.id,
    })),
  );

  if (exercisesError) {
    throw new Error(exercisesError.message);
  }

  revalidateFitnessViews();
  return getWorkoutLogById(user.id, log.id);
}
