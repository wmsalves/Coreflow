package com.coreflow.fitness.controller;

import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.CreateWorkoutLogRequest;
import com.coreflow.fitness.dto.WorkoutLogResponse;
import com.coreflow.fitness.service.WorkoutLogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId
    ) {
        return new ApiResponse<>("Workout logs loaded", workoutLogService.listWorkoutLogs(userId));
    }

    @PostMapping
    public ApiResponse<WorkoutLogResponse> logWorkout(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestBody CreateWorkoutLogRequest request
    ) {
        return new ApiResponse<>("Workout logged", workoutLogService.logWorkout(userId, request));
    }
}
