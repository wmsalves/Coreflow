import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  FocusRunHistory,
  FocusWorkspaceData,
  StudySession,
} from "@/features/focus/types/focus-types";
import { studySessionSelect, toStudySession } from "@/features/focus/session-storage";

type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];
type FocusRunRow = Pick<
  Database["public"]["Tables"]["focus_runs"]["Row"],
  | "cycles_completed"
  | "duration_seconds"
  | "ended_at"
  | "id"
  | "started_at"
  | "status"
  | "study_session_id"
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

export async function getFocusDashboardSnapshot(userId: string) {
  const data = await getFocusWorkspaceData(userId);
  const pendingSessions = data.sessions.filter((session) => session.status === "pending").length;
  const completedSessions = data.sessions.filter((session) => session.status === "completed").length;
  const nextSession = data.sessions.find((session) => session.status === "pending") ?? null;

  return {
    activeSession: data.activeSession
      ? {
          completedFocusSeconds: data.activeSession.completedFocusSeconds,
          id: data.activeSession.id,
          status: data.activeSession.status,
          title: data.activeSession.title,
          totalCyclesCompleted: data.activeSession.totalCyclesCompleted,
        }
      : null,
    completedSessions,
    nextSession: nextSession
      ? {
          dueDate: nextSession.dueDate,
          estimatedMinutes: nextSession.estimatedMinutes,
          id: nextSession.id,
          title: nextSession.title,
        }
      : null,
    pendingSessions,
    todayFocusSeconds: data.todayFocusSeconds,
    weekFocusSeconds: data.weekFocusSeconds,
  };
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
      return {
        activeSession: null,
        completedSessions: [],
        history: [],
        sessions: [],
        standaloneFocusSeconds: 0,
        todayFocusSeconds: 0,
        weekFocusSeconds: 0,
      };
    }

    throw new Error(sessionsError.message);
  }

  const { data: focusRunRows, error: focusRunsError } = await supabase
    .from("focus_runs")
    .select("cycles_completed, duration_seconds, ended_at, id, started_at, status, study_session_id")
    .eq("user_id", userId);

  if (focusRunsError && !isMissingSchemaError(focusRunsError)) {
    throw new Error(focusRunsError.message);
  }

  const focusTotals = getFocusTotals((focusRunRows ?? []) as FocusRunRow[]);
  const sessions = ((sessionRows ?? []) as StudySessionRow[]).map((sessionRow) => {
    const session = toStudySession(sessionRow, focusTotals.sessionSeconds.get(sessionRow.id));
    return {
      ...session,
      totalCyclesCompleted: focusTotals.sessionCycles.get(sessionRow.id) ?? 0,
      totalFocusRuns: focusTotals.sessionRunCounts.get(sessionRow.id) ?? 0,
    };
  });
  const sessionMap = new Map(sessions.map((session) => [session.id, session]));
  const activeSession = sessions.find((session) => session.status === "in_progress") ?? null;
  const completedSessions = sessions
    .filter((session) => session.status === "completed")
    .sort(
      (first, second) =>
        new Date(second.completedAt ?? second.dueDate).getTime() -
        new Date(first.completedAt ?? first.dueDate).getTime(),
    );

  return {
    activeSession,
    completedSessions,
    history: focusTotals.history.map((entry) => {
      const session = entry.sessionId ? sessionMap.get(entry.sessionId) : null;
      return {
        ...entry,
        sessionStatus: session?.status ?? null,
        sessionTitle: session?.title ?? (entry.sessionId ? "Study session" : "Free focus"),
      };
    }),
    sessions,
    standaloneFocusSeconds: focusTotals.standaloneSeconds,
    todayFocusSeconds: focusTotals.todayFocusSeconds,
    weekFocusSeconds: focusTotals.weekFocusSeconds,
  };
}

function getFocusTotals(rows: FocusRunRow[]) {
  const sessionSeconds = new Map<string, number>();
  const sessionCycles = new Map<string, number>();
  const sessionRunCounts = new Map<string, number>();
  const history: FocusRunHistory[] = [];
  let standaloneSeconds = 0;
  let todayFocusSeconds = 0;
  let weekFocusSeconds = 0;
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

  for (const row of rows) {
    const endedAt = new Date(row.ended_at);
    const endedDateKey = row.ended_at.slice(0, 10);

    if (endedDateKey === todayKey) {
      todayFocusSeconds += row.duration_seconds;
    }

    if (endedAt >= weekStart) {
      weekFocusSeconds += row.duration_seconds;
    }

    if (row.study_session_id) {
      sessionSeconds.set(
        row.study_session_id,
        (sessionSeconds.get(row.study_session_id) ?? 0) + row.duration_seconds,
      );
      sessionCycles.set(
        row.study_session_id,
        (sessionCycles.get(row.study_session_id) ?? 0) + row.cycles_completed,
      );
      sessionRunCounts.set(
        row.study_session_id,
        (sessionRunCounts.get(row.study_session_id) ?? 0) + 1,
      );
    } else {
      standaloneSeconds += row.duration_seconds;
    }

    history.push({
      completedAt: row.ended_at,
      cyclesCompleted: row.cycles_completed,
      durationSeconds: row.duration_seconds,
      id: row.id,
      sessionId: row.study_session_id,
      sessionStatus: null,
      sessionTitle: row.study_session_id ? "Study session" : "Free focus",
      startedAt: row.started_at,
    });
  }

  return {
    history: history.sort(
      (first, second) =>
        new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime(),
    ),
    sessionCycles,
    sessionRunCounts,
    sessionSeconds,
    standaloneSeconds,
    todayFocusSeconds,
    weekFocusSeconds,
  };
}
