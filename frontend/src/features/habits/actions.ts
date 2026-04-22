"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOptionalString, getRequiredString } from "@/lib/utils";

export type HabitActionState = {
  error: string | null;
  success: boolean;
};

function revalidateHabitViews() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/habits");
}

function actionSuccess(): HabitActionState {
  return {
    error: null,
    success: true,
  };
}

function actionError(error: unknown): HabitActionState {
  return {
    error: error instanceof Error ? error.message : "Something went wrong.",
    success: false,
  };
}

export async function createHabitAction(
  _previousState: HabitActionState,
  formData: FormData,
): Promise<HabitActionState> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  try {
    const frequencyValue = Number(getRequiredString(formData, "frequencyPerWeek"));
    const frequencyPerWeek = Number.isFinite(frequencyValue)
      ? Math.max(1, Math.min(7, Math.trunc(frequencyValue)))
      : 7;

    const { error } = await supabase.from("habits").insert({
      user_id: user.id,
      name: getRequiredString(formData, "name", { maxLength: 120 }),
      description: getOptionalString(formData, "description", { maxLength: 1000 }),
      frequency_per_week: frequencyPerWeek,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateHabitViews();
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleHabitCompletionAction(
  _previousState: HabitActionState,
  formData: FormData,
): Promise<HabitActionState> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  try {
    const habitId = getRequiredString(formData, "habitId");
    const today = new Date().toISOString().slice(0, 10);

    const { data: existingLog, error: existingLogError } = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("user_id", user.id)
      .eq("completed_on", today)
      .maybeSingle();

    if (existingLogError) {
      throw new Error(existingLogError.message);
    }

    if (existingLog) {
      const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("id", existingLog.id)
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase.from("habit_logs").insert({
        completed_on: today,
        habit_id: habitId,
        user_id: user.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    revalidateHabitViews();
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteHabitAction(
  _previousState: HabitActionState,
  formData: FormData,
): Promise<HabitActionState> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  try {
    const habitId = getRequiredString(formData, "habitId");

    const { error } = await supabase.from("habits").delete().eq("id", habitId).eq("user_id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidateHabitViews();
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}
