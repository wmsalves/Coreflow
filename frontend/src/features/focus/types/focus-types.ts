export type FocusLevel = "low" | "medium" | "high";

export type FocusStatus = "pending" | "in_progress" | "completed" | "canceled" | "archived";

export type PomodoroPhase = "focus" | "short_break" | "long_break" | "complete";

export type PomodoroSettings = {
  cycles: number;
  focusMinutes: number;
  longBreakMinutes: number;
  shortBreakMinutes: number;
};

export type StudySession = {
  completedAt: string | null;
  id: string;
  title: string;
  description: string;
  difficulty: FocusLevel;
  importance: FocusLevel;
  estimatedMinutes: number;
  startDate: string;
  dueDate: string;
  status: FocusStatus;
  subject: string;
  completedFocusSeconds: number;
  totalCyclesCompleted: number;
  totalFocusRuns: number;
};

export type StudySessionInput = Omit<
  StudySession,
  "completedAt" | "completedFocusSeconds" | "id" | "status" | "totalCyclesCompleted" | "totalFocusRuns"
>;

export type FocusFilters = {
  difficulty: FocusLevel | "all";
  importance: FocusLevel | "all";
  status: FocusStatus | "all";
};

export type FocusWorkspaceData = {
  activeSession: StudySession | null;
  completedSessions: StudySession[];
  history: FocusRunHistory[];
  sessions: StudySession[];
  standaloneFocusSeconds: number;
  todayFocusSeconds: number;
  weekFocusSeconds: number;
};

export type FocusRunHistory = {
  completedAt: string;
  cyclesCompleted: number;
  durationSeconds: number;
  id: string;
  sessionId: string | null;
  sessionStatus: FocusStatus | null;
  sessionTitle: string;
  startedAt: string;
};
