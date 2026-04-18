package com.coreflow.fitness.dto;

import java.util.List;

public record ExerciseDetailResponse(
        String id,
        Long internalId,
        String name,
        String gifUrl,
        String imageUrl,
        String videoUrl,
        String bodyPart,
        String target,
        String equipment,
        List<String> secondaryMuscles,
        List<String> instructions
) {
}
