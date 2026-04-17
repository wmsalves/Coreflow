package com.coreflow.fitness.controller;

import com.coreflow.common.response.ApiResponse;
import com.coreflow.fitness.dto.FitnessOverviewResponse;
import com.coreflow.fitness.service.FitnessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fitness")
public class FitnessController {

    private final FitnessService fitnessService;

    public FitnessController(FitnessService fitnessService) {
        this.fitnessService = fitnessService;
    }

    @GetMapping
    public ApiResponse<FitnessOverviewResponse> overview() {
        return new ApiResponse<>("Fitness module ready", fitnessService.getOverview());
    }
}
