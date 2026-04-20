package com.coreflow.fitness.controller;

import com.coreflow.auth.security.AuthenticatedSupabaseUser;
import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.CreateWorkoutLogRequest;
import com.coreflow.fitness.dto.WorkoutLogResponse;
import com.coreflow.fitness.service.WorkoutLogService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fitness/workout-logs")
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    public WorkoutLogController(WorkoutLogService workoutLogService) {
        this.workoutLogService = workoutLogService;
    }

    @GetMapping
    public ApiResponse<List<WorkoutLogResponse>> listWorkoutLogs(
            @AuthenticationPrincipal AuthenticatedSupabaseUser user
    ) {
        return new ApiResponse<>("Workout logs loaded", workoutLogService.listWorkoutLogs(user.userId()));
    }

    @PostMapping
    public ApiResponse<WorkoutLogResponse> logWorkout(
            @AuthenticationPrincipal AuthenticatedSupabaseUser user,
            @RequestBody CreateWorkoutLogRequest request
    ) {
        return new ApiResponse<>("Workout logged", workoutLogService.logWorkout(user.userId(), request));
    }
}
