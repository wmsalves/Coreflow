import { notFound } from "next/navigation";
import { WorkoutLogDetail } from "@/features/fitness/components/workout-log-detail";
import { getWorkoutLogById } from "@/features/fitness/queries";
import { requireUser } from "@/lib/auth";

export default async function WorkoutHistoryDetailPage(
  props: PageProps<"/dashboard/fitness/history/[logId]">,
) {
  const user = await requireUser();
  const { logId } = await props.params;
  let log;

  try {
    log = await getWorkoutLogById(user.id, logId);
  } catch {
    notFound();
  }

  return <WorkoutLogDetail log={log} />;
}
