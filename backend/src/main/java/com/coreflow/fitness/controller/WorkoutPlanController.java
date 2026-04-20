package com.coreflow.fitness.controller;

import com.coreflow.auth.security.AuthenticatedSupabaseUser;
import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.AddExerciseRequest;
import com.coreflow.fitness.dto.CreateWorkoutPlanRequest;
import com.coreflow.fitness.dto.WorkoutPlanResponse;
import com.coreflow.fitness.service.WorkoutPlanService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
            @AuthenticationPrincipal AuthenticatedSupabaseUser user
    ) {
        return new ApiResponse<>("Workout plans loaded", workoutPlanService.listWorkoutPlans(user.userId()));
    }

    @PostMapping
    public ApiResponse<WorkoutPlanResponse> createWorkoutPlan(
            @AuthenticationPrincipal AuthenticatedSupabaseUser user,
            @RequestBody CreateWorkoutPlanRequest request
    ) {
        return new ApiResponse<>("Workout plan created", workoutPlanService.createWorkoutPlan(user.userId(), request));
    }

    @PostMapping("/{id}/exercises")
    public ApiResponse<WorkoutPlanResponse> addExercise(
            @AuthenticationPrincipal AuthenticatedSupabaseUser user,
            @PathVariable Long id,
            @RequestBody AddExerciseRequest request
    ) {
        return new ApiResponse<>("Exercise added to workout plan", workoutPlanService.addExercise(user.userId(), id, request));
    }

    @DeleteMapping("/{id}/exercises/{exerciseId}")
    public ApiResponse<WorkoutPlanResponse> removeExercise(
            @AuthenticationPrincipal AuthenticatedSupabaseUser user,
            @PathVariable Long id,
            @PathVariable Long exerciseId
    ) {
        return new ApiResponse<>(
                "Exercise removed from workout plan",
                workoutPlanService.removeExercise(user.userId(), id, exerciseId)
        );
    }
}
