import { FocusWorkspace } from "@/features/focus/components/focus-workspace";
import { getFocusWorkspaceData } from "@/features/focus/queries";
import { requireUser } from "@/lib/auth";

export default async function FocusPage() {
  const user = await requireUser();
  const focusData = await getFocusWorkspaceData(user.id);

  return (
    <FocusWorkspace
      initialActiveSession={focusData.activeSession}
      initialHistory={focusData.history}
      initialSessions={focusData.sessions}
      initialStandaloneFocusSeconds={focusData.standaloneFocusSeconds}
      initialTodayFocusSeconds={focusData.todayFocusSeconds}
      initialWeekFocusSeconds={focusData.weekFocusSeconds}
    />
  );
}
