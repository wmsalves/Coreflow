import { FitnessWorkspace } from "@/features/fitness/components/fitness-workspace";
import { getWorkoutLogs, getWorkoutPlans, listExercises } from "@/lib/api/fitness";
import { requireAccessToken } from "@/lib/auth";

export default async function FitnessPage() {
  const accessToken = await requireAccessToken();
  const [exercisesResult, plansResult, logsResult] = await Promise.allSettled([
    listExercises({ accessToken }),
    getWorkoutPlans({ accessToken }),
    getWorkoutLogs({ accessToken }),
  ]);

  const initialExercises = exercisesResult.status === "fulfilled" ? exercisesResult.value : [];
  const initialPlans = plansResult.status === "fulfilled" ? plansResult.value : [];
  const initialLogs = logsResult.status === "fulfilled" ? logsResult.value : [];
  const initialLoadFailed =
    exercisesResult.status === "rejected" ||
    plansResult.status === "rejected" ||
    logsResult.status === "rejected";

  return (
    <FitnessWorkspace
      initialExercises={initialExercises}
      initialLoadFailed={initialLoadFailed}
      initialLogs={initialLogs}
      initialPlans={initialPlans}
    />
  );
}
