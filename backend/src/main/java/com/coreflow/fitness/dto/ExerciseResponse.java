package com.coreflow.fitness.dto;

import java.util.List;

public record ExerciseResponse(
        Long id,
        String externalId,
        String source,
        String name,
        String gifUrl,
        String imageUrl,
        String videoUrl,
        String bodyPart,
        String target,
        String category,
        String targetMuscle,
        String equipment,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
