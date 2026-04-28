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
        String mediaUrl,
        ExerciseMediaResponse resolvedMedia,
        String bodyPart,
        String target,
        String category,
        String targetMuscle,
        String equipment,
        String difficulty,
        List<String> muscles,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
