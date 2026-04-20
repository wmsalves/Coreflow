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
};

export type StudySessionInput = Omit<StudySession, "completedFocusSeconds" | "id" | "status">;

export type FocusFilters = {
  difficulty: FocusLevel | "all";
  importance: FocusLevel | "all";
  status: FocusStatus | "all";
};

export type FocusWorkspaceData = {
  sessions: StudySession[];
  standaloneFocusSeconds: number;
};
