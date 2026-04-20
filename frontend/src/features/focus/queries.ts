import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { FocusWorkspaceData, StudySession } from "@/features/focus/types/focus-types";
import { studySessionSelect, toStudySession } from "@/features/focus/session-storage";

type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];
type FocusRunRow = Pick<
  Database["public"]["Tables"]["focus_runs"]["Row"],
  "duration_seconds" | "study_session_id"
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
    error.message?.includes("schema cache")
  );
}

export async function getStudySessionsOverview(userId: string): Promise<StudySession[]> {
  const data = await getFocusWorkspaceData(userId);
  return data.sessions;
}

export async function getFocusWorkspaceData(userId: string): Promise<FocusWorkspaceData> {
  const supabase = await createServerSupabaseClient();
  const { data: sessionRows, error: sessionsError } = await supabase
    .from("study_sessions")
    .select(studySessionSelect)
    .eq("user_id", userId)
    .order("due_date", { ascending: true });

  if (sessionsError) {
    if (isMissingSchemaError(sessionsError)) {
      return { sessions: [], standaloneFocusSeconds: 0 };
    }

    throw new Error(sessionsError.message);
  }

  const { data: focusRunRows, error: focusRunsError } = await supabase
    .from("focus_runs")
    .select("study_session_id, duration_seconds")
    .eq("user_id", userId);

  if (focusRunsError && !isMissingSchemaError(focusRunsError)) {
    throw new Error(focusRunsError.message);
  }

  const focusTotals = getFocusTotals((focusRunRows ?? []) as FocusRunRow[]);
  const sessions = ((sessionRows ?? []) as StudySessionRow[]).map((session) =>
    toStudySession(session, focusTotals.sessionSeconds.get(session.id)),
  );

  return {
    sessions,
    standaloneFocusSeconds: focusTotals.standaloneSeconds,
  };
}

function getFocusTotals(rows: FocusRunRow[]) {
  const sessionSeconds = new Map<string, number>();
  let standaloneSeconds = 0;

  for (const row of rows) {
    if (row.study_session_id) {
      sessionSeconds.set(
        row.study_session_id,
        (sessionSeconds.get(row.study_session_id) ?? 0) + row.duration_seconds,
      );
    } else {
      standaloneSeconds += row.duration_seconds;
    }
  }

  return { sessionSeconds, standaloneSeconds };
}
