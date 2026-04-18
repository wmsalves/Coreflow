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
  userId: number;
  name: string;
  description: string | null;
  exercises: WorkoutPlanExercise[];
  createdAt: string;
  updatedAt: string;
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

function unwrap<T>(response: ApiResponse<T>) {
  return response.data;
}

export async function listExercises() {
  const response = await apiClient<ApiResponse<ExerciseSummary[]>>("/v1/fitness/exercises");
  return unwrap(response);
}

export async function searchExercises(query: string) {
  const response = await apiClient<ApiResponse<ExerciseSummary[]>>("/v1/fitness/exercises/search", {
    query: { q: query },
  });
  return unwrap(response);
}

export async function getExerciseDetail(id: string) {
  const response = await apiClient<ApiResponse<ExerciseDetail>>(`/v1/fitness/exercises/${id}`);
  return unwrap(response);
}

export async function getWorkoutPlans() {
  const response = await apiClient<ApiResponse<WorkoutPlan[]>>("/v1/fitness/workout-plans");
  return unwrap(response);
}

export async function createWorkoutPlan(input: CreateWorkoutPlanInput) {
  const response = await apiClient<ApiResponse<WorkoutPlan>>("/v1/fitness/workout-plans", {
    body: JSON.stringify({
      description: input.description ?? "",
      name: input.name,
    }),
    method: "POST",
  });

  return unwrap(response);
}

export async function addExerciseToWorkoutPlan(planId: number, input: AddWorkoutExerciseInput) {
  const response = await apiClient<ApiResponse<WorkoutPlan>>(
    `/v1/fitness/workout-plans/${planId}/exercises`,
    {
      body: JSON.stringify(input),
      method: "POST",
    },
  );

  return unwrap(response);
}

export async function getWorkoutLogs() {
  const response = await apiClient<ApiResponse<unknown[]>>("/v1/fitness/workout-logs");
  return unwrap(response);
}

