package com.coreflow.fitness.controller;

import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.ExerciseDetailResponse;
import com.coreflow.fitness.dto.ExerciseSummaryResponse;
import com.coreflow.fitness.service.ExerciseCatalogService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fitness/exercises")
public class ExerciseController {

    private final ExerciseCatalogService exerciseCatalogService;

    public ExerciseController(ExerciseCatalogService exerciseCatalogService) {
        this.exerciseCatalogService = exerciseCatalogService;
    }

    @GetMapping
    public ApiResponse<List<ExerciseSummaryResponse>> listExercises() {
        return new ApiResponse<>("Exercises loaded", exerciseCatalogService.listExerciseSummaries());
    }

    @GetMapping("/search")
    public ApiResponse<List<ExerciseSummaryResponse>> searchExercises(@RequestParam("q") String query) {
        return new ApiResponse<>("Exercises matched", exerciseCatalogService.searchExerciseSummaries(query));
    }

    @GetMapping("/{id}")
    public ApiResponse<ExerciseDetailResponse> getExercise(@PathVariable String id) {
        return new ApiResponse<>("Exercise loaded", exerciseCatalogService.getExerciseDetail(id));
    }
}
