import { FitnessWorkspace } from "@/features/fitness/components/fitness-workspace";
import { getWorkoutPlans, listExercises } from "@/lib/api/fitness";

export default async function FitnessPage() {
  const [exercisesResult, plansResult] = await Promise.allSettled([
    listExercises(),
    getWorkoutPlans(),
  ]);

  const initialExercises = exercisesResult.status === "fulfilled" ? exercisesResult.value : [];
  const initialPlans = plansResult.status === "fulfilled" ? plansResult.value : [];
  const initialLoadFailed = exercisesResult.status === "rejected" || plansResult.status === "rejected";

  return (
    <FitnessWorkspace
      initialExercises={initialExercises}
      initialLoadFailed={initialLoadFailed}
      initialPlans={initialPlans}
    />
  );
}