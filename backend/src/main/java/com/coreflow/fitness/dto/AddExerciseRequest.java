package com.coreflow.fitness.dto;

public record AddExerciseRequest(
        Long exerciseId,
        Integer sortOrder,
        Integer sets,
        Integer reps,
        Integer restSeconds,
        Integer durationSeconds,
        String notes
) {
}
