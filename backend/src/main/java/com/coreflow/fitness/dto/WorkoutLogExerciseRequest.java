package com.coreflow.fitness.dto;

public record WorkoutLogExerciseRequest(
        Long exerciseId,
        Integer sortOrder,
        Integer setsCompleted,
        Integer repsCompleted,
        Double weight,
        String notes
) {
}
