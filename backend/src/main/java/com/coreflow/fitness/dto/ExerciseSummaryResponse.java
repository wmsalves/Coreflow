package com.coreflow.fitness.dto;

public record ExerciseSummaryResponse(
        String id,
        Long internalId,
        String name,
        String gifUrl,
        String imageUrl,
        String videoUrl,
        String bodyPart,
        String target,
        String equipment
) {
}
