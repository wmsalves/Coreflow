import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { StudySession } from "@/features/focus/types/focus-types";
import { toStudySession } from "@/features/focus/session-storage";

type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];

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

export async function getStudySessionsOverview(userId: string): Promise<StudySession[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("study_sessions")
    .select("id, user_id, subject, notes, started_at, ended_at, duration_minutes, created_at")
    .eq("user_id", userId)
    .order("started_at", { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }

    throw new Error(error.message);
  }

  return ((data ?? []) as StudySessionRow[]).map(toStudySession);
}
