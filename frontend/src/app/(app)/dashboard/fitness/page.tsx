import { FitnessWorkspace } from "@/features/fitness/components/fitness-workspace";
import { getFitnessWorkspaceData } from "@/features/fitness/queries";
import { requireAccessToken, requireUser } from "@/lib/auth";

export default async function FitnessPage() {
  const [user, accessToken] = await Promise.all([requireUser(), requireAccessToken()]);
  const fitnessData = await getFitnessWorkspaceData(user.id, accessToken);

  return (
    <FitnessWorkspace
      initialActiveSession={fitnessData.initialActiveSession}
      initialExercises={fitnessData.initialExercises}
      initialLoadFailed={fitnessData.initialLoadFailed}
      initialLogs={fitnessData.initialLogs}
      initialPlans={fitnessData.initialPlans}
    />
  );
}
