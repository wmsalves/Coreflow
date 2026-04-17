package com.coreflow.fitness.dto;

import java.time.Instant;
import java.util.List;

public record CreateWorkoutLogRequest(
        Long workoutPlanId,
        Instant completedAt,
        Integer durationMinutes,
        String notes,
        List<WorkoutLogExerciseRequest> exercises
) {
}
