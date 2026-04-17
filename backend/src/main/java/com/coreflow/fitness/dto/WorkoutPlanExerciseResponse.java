package com.coreflow.fitness.dto;

public record WorkoutPlanExerciseResponse(
        Long id,
        Long exerciseId,
        ExerciseResponse exercise,
        Integer sortOrder,
        Integer sets,
        Integer reps,
        Integer restSeconds,
        Integer durationSeconds,
        String notes
) {
}
