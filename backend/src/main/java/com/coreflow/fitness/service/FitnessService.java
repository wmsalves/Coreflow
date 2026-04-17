package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.FitnessOverviewResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FitnessService {

    public FitnessOverviewResponse getOverview() {
        return new FitnessOverviewResponse(
                "fitness",
                List.of(
                        "exercise-catalog",
                        "custom-workout-plans",
                        "workout-logs",
                        "external-exercise-provider-ready"
                )
        );
    }
}
