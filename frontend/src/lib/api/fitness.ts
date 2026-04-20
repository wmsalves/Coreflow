import { apiClient } from "@/lib/api/client";

type ApiResponse<T> = {
  message: string;
  data: T;
};

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
  id: number;
  exerciseId: number;
  exercise: {
    id: number;
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
  id: number;
  userId: string;
  name: string;
  description: string | null;
  exercises: WorkoutPlanExercise[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutLogExercise = {
  exerciseId: number;
  notes: string | null;
  repsCompleted: number | null;
  setsCompleted: number | null;
  sortOrder: number | null;
  weight: number | null;
};

export type WorkoutLog = {
  completedAt: string;
  durationMinutes: number | null;
  exercises: WorkoutLogExercise[];
  id: number;
  notes: string | null;
  userId: string;
  workoutPlanId: number | null;
};

export type CreateWorkoutPlanInput = {
  name: string;
  description?: string;
};

export type AddWorkoutExerciseInput = {
  exerciseId: number;
  sortOrder?: number;
  sets?: number;
  reps?: number;
  restSeconds?: number;
  notes?: string;
};

export type CreateWorkoutLogInput = {
  completedAt?: string;
  durationMinutes?: number;
  exercises: Array<{
    exerciseId: number;
    notes?: string;
    repsCompleted?: number;
    setsCompleted?: number;
    sortOrder?: number | null;
    weight?: number;
  }>;
  notes?: string;
  workoutPlanId?: number;
};

function unwrap<T>(response: ApiResponse<T>) {
  return response.data;
}

type ApiAuthOptions = {
  accessToken?: string | null;
};

export async function listExercises(options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<ExerciseSummary[]>>("/v1/fitness/exercises", {
    accessToken: options.accessToken,
  });
  return unwrap(response);
}

export async function searchExercises(query: string, options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<ExerciseSummary[]>>("/v1/fitness/exercises/search", {
    accessToken: options.accessToken,
    query: { q: query.trim() },
  });
  return unwrap(response);
}

export async function getExerciseDetail(id: string, options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<ExerciseDetail>>(
    `/v1/fitness/exercises/${encodeURIComponent(id)}`,
    {
      accessToken: options.accessToken,
    },
  );
  return unwrap(response);
}

export async function getWorkoutPlans(options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<WorkoutPlan[]>>("/v1/fitness/workout-plans", {
    accessToken: options.accessToken,
  });
  return unwrap(response);
}

export async function createWorkoutPlan(input: CreateWorkoutPlanInput, options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<WorkoutPlan>>("/v1/fitness/workout-plans", {
    accessToken: options.accessToken,
    body: JSON.stringify({
      description: input.description ?? "",
      name: input.name,
    }),
    method: "POST",
  });

  return unwrap(response);
}

export async function addExerciseToWorkoutPlan(
  planId: number,
  input: AddWorkoutExerciseInput,
  options: ApiAuthOptions = {},
) {
  const response = await apiClient<ApiResponse<WorkoutPlan>>(
    `/v1/fitness/workout-plans/${planId}/exercises`,
    {
      accessToken: options.accessToken,
      body: JSON.stringify(input),
      method: "POST",
    },
  );

  return unwrap(response);
}

export async function getWorkoutLogs(options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<WorkoutLog[]>>("/v1/fitness/workout-logs", {
    accessToken: options.accessToken,
  });
  return unwrap(response);
}

export async function logWorkout(input: CreateWorkoutLogInput, options: ApiAuthOptions = {}) {
  const response = await apiClient<ApiResponse<WorkoutLog>>("/v1/fitness/workout-logs", {
    accessToken: options.accessToken,
    body: JSON.stringify(input),
    method: "POST",
  });

  return unwrap(response);
}

