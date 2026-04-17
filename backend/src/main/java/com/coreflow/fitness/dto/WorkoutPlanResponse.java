package com.coreflow.fitness.dto;

import java.time.Instant;
import java.util.List;

public record WorkoutPlanResponse(
        Long id,
        Long userId,
        String name,
        String description,
        List<WorkoutPlanExerciseResponse> exercises,
        Instant createdAt,
        Instant updatedAt
) {
}
