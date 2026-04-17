package com.coreflow.fitness.dto;

import java.util.List;

public record ExternalExerciseDto(
        String externalId,
        String source,
        String name,
        String category,
        String targetMuscle,
        String equipment,
        String gifUrl,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
