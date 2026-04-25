export type ExerciseSummary = {
  id: string;
  internalId: number | null;
  name: string;
  gifUrl: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  bodyPart: string | null;
  target: string | null;
  equipment: string | null;
};

export type ExerciseDetail = ExerciseSummary & {
  secondaryMuscles: string[];
  instructions: string[];
};

export type WorkoutPlanExercise = {
  id: string;
  exerciseId: number | null;
  exercise: {
    id: number | null;
    externalId: string | null;
    source: string | null;
    name: string;
    gifUrl: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    bodyPart: string | null;
    target: string | null;
    category: string | null;
    targetMuscle: string | null;
    equipment: string | null;
    secondaryMuscles: string[];
    instructions: string[];
  };
  sortOrder: number | null;
  sets: number | null;
  reps: number | null;
  restSeconds: number | null;
  durationSeconds: number | null;
  notes: string | null;
};

export type WorkoutPlan = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  exercises: WorkoutPlanExercise[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutLogExercise = {
  bodyPart: string | null;
  completed: boolean;
  completedAt: string | null;
  equipment: string | null;
  externalId: string | null;
  gifUrl: string | null;
  imageUrl: string | null;
  exerciseId: number | null;
  name: string;
  notes: string | null;
  repsCompleted: number | null;
  restSeconds: number | null;
  setsCompleted: number | null;
  sortOrder: number | null;
  target: string | null;
  videoUrl: string | null;
  weight: number | null;
};

export type WorkoutLog = {
  completedAt: string;
  durationMinutes: number | null;
  exercises: WorkoutLogExercise[];
  id: string;
  notes: string | null;
  userId: string;
  workoutPlanId: string | null;
};

export type WorkoutSessionExercise = {
  bodyPart: string | null;
  completed: boolean;
  completedAt: string | null;
  equipment: string | null;
  externalId: string | null;
  gifUrl: string | null;
  id: string;
  imageUrl: string | null;
  exerciseId: number | null;
  name: string;
  notes: string | null;
  reps: number | null;
  restSeconds: number | null;
  sets: number | null;
  sortOrder: number | null;
  target: string | null;
  videoUrl: string | null;
  weight: number | null;
  workoutPlanExerciseId: string | null;
};

export type WorkoutSession = {
  completedAt: string | null;
  exercises: WorkoutSessionExercise[];
  id: string;
  startedAt: string;
  status: "cancelled" | "completed" | "in_progress";
  updatedAt: string;
  userId: string;
  workoutLogId: string | null;
  workoutPlanId: string;
};

export type ExerciseConfig = {
  sets: number;
  reps: number;
  restSeconds: number;
  notes: string;
};
