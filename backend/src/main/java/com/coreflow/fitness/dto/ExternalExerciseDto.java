package com.coreflow.fitness.dto;

import java.util.List;

public record ExternalExerciseDto(
        String externalId,
        String source,
        String name,
        String imageUrl,
        String videoUrl,
        String bodyPart,
        String target,
        String equipment,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
