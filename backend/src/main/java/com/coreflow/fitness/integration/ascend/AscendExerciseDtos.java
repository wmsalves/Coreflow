package com.coreflow.fitness.integration.ascend;

import com.fasterxml.jackson.annotation.JsonAlias;
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
            @JsonAlias({"image_url", "thumbnail", "thumbnailUrl"})
            String imageUrl,
            @JsonAlias({"gif_url", "gif", "animatedGifUrl"})
            String gifUrl,
            @JsonAlias({"video_url"})
            String videoUrl,
            String bodyPart,
            String target,
            String equipment,
            List<String> secondaryMuscles,
            List<String> instructions
    ) {
    }
}
