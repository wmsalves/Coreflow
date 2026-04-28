package com.coreflow.fitness.dto;

import java.util.List;

public record ExerciseDetailResponse(
        String id,
        Long internalId,
        String name,
        String gifUrl,
        String imageUrl,
        String videoUrl,
        String mediaUrl,
        ExerciseMediaResponse resolvedMedia,
        String bodyPart,
        String target,
        String equipment,
        String difficulty,
        String category,
        List<String> muscles,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
