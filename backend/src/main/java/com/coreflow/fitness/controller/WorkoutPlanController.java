package com.coreflow.fitness.controller;

import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.AddExerciseRequest;
import com.coreflow.fitness.dto.CreateWorkoutPlanRequest;
import com.coreflow.fitness.dto.WorkoutPlanResponse;
import com.coreflow.fitness.service.WorkoutPlanService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fitness/workout-plans")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @GetMapping
    public ApiResponse<List<WorkoutPlanResponse>> listWorkoutPlans(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId
    ) {
        return new ApiResponse<>("Workout plans loaded", workoutPlanService.listWorkoutPlans(userId));
    }

    @PostMapping
    public ApiResponse<WorkoutPlanResponse> createWorkoutPlan(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestBody CreateWorkoutPlanRequest request
    ) {
        return new ApiResponse<>("Workout plan created", workoutPlanService.createWorkoutPlan(userId, request));
    }

    @PostMapping("/{id}/exercises")
    public ApiResponse<WorkoutPlanResponse> addExercise(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @PathVariable Long id,
            @RequestBody AddExerciseRequest request
    ) {
        return new ApiResponse<>("Exercise added to workout plan", workoutPlanService.addExercise(userId, id, request));
    }

    @DeleteMapping("/{id}/exercises/{exerciseId}")
    public ApiResponse<WorkoutPlanResponse> removeExercise(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @PathVariable Long id,
            @PathVariable Long exerciseId
    ) {
        return new ApiResponse<>("Exercise removed from workout plan", workoutPlanService.removeExercise(userId, id, exerciseId));
    }
}
