package com.coreflow.fitness.integration.ascend;

import java.util.List;

public final class AscendExerciseDtos {

    private AscendExerciseDtos() {
    }

    public record AscendExerciseSearchResponse(
            Boolean success,
            List<AscendExerciseItemDto> data,
            String message
    ) {
    }

    public record AscendExerciseDetailResponse(
            Boolean success,
            AscendExerciseItemDto data,
            String message
    ) {
    }

    public record AscendExerciseItemDto(
            String exerciseId,
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
}
