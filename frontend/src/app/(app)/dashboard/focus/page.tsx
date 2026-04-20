import { FocusWorkspace } from "@/features/focus/components/focus-workspace";
import { getStudySessionsOverview } from "@/features/focus/queries";
import { requireUser } from "@/lib/auth";

export default async function FocusPage() {
  const user = await requireUser();
  const sessions = await getStudySessionsOverview(user.id);

  return <FocusWorkspace initialSessions={sessions} />;
}
