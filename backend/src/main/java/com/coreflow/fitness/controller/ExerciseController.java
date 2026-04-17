package com.coreflow.fitness.controller;

import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.ExerciseResponse;
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
    public ApiResponse<List<ExerciseResponse>> listExercises() {
        return new ApiResponse<>("Exercises loaded", exerciseCatalogService.listExercises());
    }

    @GetMapping("/search")
    public ApiResponse<List<ExerciseResponse>> searchExercises(@RequestParam("q") String query) {
        return new ApiResponse<>("Exercises matched", exerciseCatalogService.searchExercises(query));
    }

    @GetMapping("/{id}")
    public ApiResponse<ExerciseResponse> getExercise(@PathVariable Long id) {
        return new ApiResponse<>("Exercise loaded", exerciseCatalogService.getExercise(id));
    }
}
