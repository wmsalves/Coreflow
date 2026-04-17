package com.coreflow.fitness.dto;

import java.util.List;

public record FitnessOverviewResponse(String module, List<String> capabilities) {
}
