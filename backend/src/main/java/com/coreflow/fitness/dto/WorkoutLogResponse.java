package com.coreflow.fitness.dto;

import java.time.Instant;
import java.util.List;

public record WorkoutLogResponse(
        Long id,
        String userId,
        Long workoutPlanId,
        Instant completedAt,
        Integer durationMinutes,
        String notes,
        List<WorkoutLogExerciseResponse> exercises
) {
}
