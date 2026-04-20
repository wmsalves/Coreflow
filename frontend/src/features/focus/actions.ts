"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  FocusStatus,
  StudySession,
  StudySessionInput,
} from "@/features/focus/types/focus-types";
import {
  studySessionSelect,
  toStudySession,
} from "@/features/focus/session-storage";

const maxTitleLength = 160;
const maxDescriptionLength = 1000;
const maxSubjectLength = 120;
const maxFocusRunSeconds = 24 * 60 * 60;
const statuses: FocusStatus[] = ["pending", "in_progress", "completed", "canceled", "archived"];

type LogFocusRunInput = {
  durationSeconds: number;
  studySessionId?: string | null;
};

type LogFocusRunResult = {
  standaloneFocusSeconds?: number;
  studySession?: StudySession;
};

export async function createStudySessionAction(input: StudySessionInput): Promise<StudySession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const normalizedInput = normalizeStudySessionInput(input);

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      difficulty: normalizedInput.difficulty,
      due_date: normalizedInput.dueDate,
      estimated_minutes: normalizedInput.estimatedMinutes,
      importance: normalizedInput.importance,
      notes: normalizedInput.description || null,
      started_at: new Date(`${normalizedInput.startDate}T00:00:00.000Z`).toISOString(),
      status: "pending",
      subject: normalizedInput.subject,
      title: normalizedInput.title,
      user_id: user.id,
    })
    .select(studySessionSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/focus");
  return toStudySession(data, 0);
}

export async function updateStudySessionStatusAction(
  sessionId: string,
  status: FocusStatus,
): Promise<StudySession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  if (!statuses.includes(status)) {
    throw new Error("Invalid study session status.");
  }

  const { data: currentSession, error: currentSessionError } = await supabase
    .from("study_sessions")
    .select(studySessionSelect)
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (currentSessionError) {
    throw new Error(currentSessionError.message);
  }

  const endedAt =
    status === "completed"
      ? currentSession.ended_at ?? new Date().toISOString()
      : status === "archived"
        ? currentSession.ended_at
        : null;

  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      ended_at: endedAt,
      status,
    })
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .select(studySessionSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const totalSeconds = await getSessionFocusSeconds(supabase, user.id, sessionId);

  revalidatePath("/dashboard/focus");
  return toStudySession(data, totalSeconds);
}

export async function logFocusRunAction(input: LogFocusRunInput): Promise<LogFocusRunResult> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const durationSeconds = clampInteger(input.durationSeconds, 1, maxFocusRunSeconds);
  const endedAt = new Date();
  const startedAt = new Date(endedAt.getTime() - durationSeconds * 1000);

  if (input.studySessionId) {
    const { data: session, error: sessionError } = await supabase
      .from("study_sessions")
      .select(studySessionSelect)
      .eq("id", input.studySessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (session.status === "completed" || session.status === "canceled" || session.status === "archived") {
      throw new Error("Cannot log focus time to an inactive study session.");
    }
  }

  const { error: insertError } = await supabase.from("focus_runs").insert({
    duration_seconds: durationSeconds,
    ended_at: endedAt.toISOString(),
    source: "pomodoro",
    started_at: startedAt.toISOString(),
    study_session_id: input.studySessionId ?? null,
    user_id: user.id,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/dashboard/focus");

  if (!input.studySessionId) {
    return {
      standaloneFocusSeconds: await getStandaloneFocusSeconds(supabase, user.id),
    };
  }

  return {
    studySession: await refreshSessionFocusSummary(supabase, user.id, input.studySessionId),
  };
}

export async function deleteStudySessionAction(sessionId: string): Promise<string> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("study_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/focus");
  revalidatePath("/dashboard");
  return sessionId;
}

async function refreshSessionFocusSummary(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  sessionId: string,
) {
  const totalSeconds = await getSessionFocusSeconds(supabase, userId, sessionId);
  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      duration_minutes: Math.ceil(totalSeconds / 60),
      status: "in_progress",
    })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .neq("status", "completed")
    .select(studySessionSelect)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return toStudySession(data, totalSeconds);
  }

  const { data: currentSession, error: currentSessionError } = await supabase
    .from("study_sessions")
    .select(studySessionSelect)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (currentSessionError) {
    throw new Error(currentSessionError.message);
  }

  return toStudySession(currentSession, totalSeconds);
}

async function getSessionFocusSeconds(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  sessionId: string,
) {
  const { data, error } = await supabase
    .from("focus_runs")
    .select("duration_seconds")
    .eq("user_id", userId)
    .eq("study_session_id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce((total, run) => total + run.duration_seconds, 0);
}

async function getStandaloneFocusSeconds(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("focus_runs")
    .select("duration_seconds")
    .eq("user_id", userId)
    .is("study_session_id", null);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce((total, run) => total + run.duration_seconds, 0);
}

function normalizeStudySessionInput(input: StudySessionInput): StudySessionInput {
  return {
    description: limit(input.description?.trim() ?? "", maxDescriptionLength),
    difficulty: input.difficulty,
    dueDate: normalizeDate(input.dueDate),
    estimatedMinutes: clampInteger(input.estimatedMinutes, 5, 600),
    importance: input.importance,
    startDate: normalizeDate(input.startDate),
    subject: limit(input.subject?.trim() || "Focus", maxSubjectLength),
    title: limit(requireText(input.title, "Study session title"), maxTitleLength),
  };
}

function requireText(value: string, fieldName: string) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function limit(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function normalizeDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date().toISOString().slice(0, 10);
  }

  return value;
}
