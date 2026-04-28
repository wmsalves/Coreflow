import type { Database } from "@/types/database";
import type {
  FocusLevel,
  FocusStatus,
  StudySession,
} from "@/features/focus/types/focus-types";

type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];

export const studySessionSelect =
  "id, user_id, title, subject, notes, status, difficulty, importance, estimated_minutes, due_date, started_at, ended_at, duration_minutes, created_at";

const defaultDifficulty: FocusLevel = "medium";
const defaultImportance: FocusLevel = "medium";
const defaultStatus: FocusStatus = "pending";
const defaultEstimatedMinutes = 45;

const levels: FocusLevel[] = ["low", "medium", "high"];
const statuses: FocusStatus[] = ["pending", "in_progress", "completed", "canceled", "archived"];

export function toStudySession(row: StudySessionRow, completedFocusSeconds?: number): StudySession {
  const startDate = toDateKey(row.started_at);
  const totalFocusSeconds =
    completedFocusSeconds ?? (row.duration_minutes === null ? 0 : row.duration_minutes * 60);

  return {
    completedAt: row.ended_at,
    completedFocusSeconds: totalFocusSeconds,
    description: row.notes ?? "",
    difficulty: normalizeLevel(row.difficulty, defaultDifficulty),
    dueDate: row.due_date ?? startDate,
    estimatedMinutes:
      row.estimated_minutes ?? (totalFocusSeconds ? Math.ceil(totalFocusSeconds / 60) : defaultEstimatedMinutes),
    id: row.id,
    importance: normalizeLevel(row.importance, defaultImportance),
    startDate,
    status: normalizeStatus(row.status, row.ended_at),
    subject: row.subject ?? "Focus",
    title: row.title || row.subject || "Study session",
    totalCyclesCompleted: 0,
    totalFocusRuns: 0,
  };
}

function normalizeLevel(value: string, fallback: FocusLevel): FocusLevel {
  return levels.includes(value as FocusLevel) ? (value as FocusLevel) : fallback;
}

function normalizeStatus(value: string, endedAt: string | null): FocusStatus {
  if (statuses.includes(value as FocusStatus)) {
    return value as FocusStatus;
  }

  return endedAt ? "completed" : defaultStatus;
}

function toDateKey(value: string) {
  return value.slice(0, 10);
}
