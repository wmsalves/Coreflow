"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { StudySession, StudySessionInput } from "@/features/focus/types/focus-types";
import {
  serializeStudySessionMetadata,
  toStudySession,
  withStatus,
} from "@/features/focus/session-storage";

const maxTitleLength = 160;
const maxDescriptionLength = 1000;
const maxSubjectLength = 120;

export async function createStudySessionAction(input: StudySessionInput): Promise<StudySession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const normalizedInput = normalizeStudySessionInput(input);

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      notes: serializeStudySessionMetadata(normalizedInput),
      started_at: new Date(`${normalizedInput.startDate}T00:00:00.000Z`).toISOString(),
      subject: normalizedInput.subject,
      user_id: user.id,
    })
    .select("id, user_id, subject, notes, started_at, ended_at, duration_minutes, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/focus");
  return toStudySession(data);
}

export async function updateStudySessionStatusAction(
  session: StudySession,
  status: StudySession["status"],
  focusMinutes?: number,
): Promise<StudySession> {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const updatedSession = withStatus(session, status, focusMinutes);

  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      duration_minutes: updatedSession.completedFocusMinutes,
      ended_at: status === "completed" ? new Date().toISOString() : null,
      notes: serializeStudySessionMetadata(updatedSession),
      subject: updatedSession.subject,
    })
    .eq("id", session.id)
    .eq("user_id", user.id)
    .select("id, user_id, subject, notes, started_at, ended_at, duration_minutes, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/focus");
  return toStudySession(data);
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
