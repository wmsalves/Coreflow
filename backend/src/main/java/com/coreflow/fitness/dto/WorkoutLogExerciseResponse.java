package com.coreflow.fitness.dto;

public record WorkoutLogExerciseResponse(
        Long exerciseId,
        Integer sortOrder,
        Integer setsCompleted,
        Integer repsCompleted,
        Double weight,
        String notes
) {
}
