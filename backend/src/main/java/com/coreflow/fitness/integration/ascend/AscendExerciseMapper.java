package com.coreflow.fitness.integration.ascend;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import com.coreflow.fitness.integration.ascend.AscendExerciseDtos.AscendExerciseItemDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AscendExerciseMapper {

    public ExternalExerciseDto toExternalExercise(AscendExerciseItemDto item) {
        return new ExternalExerciseDto(
                item.exerciseId(),
                "ascend",
                item.name(),
                resolveGifUrl(item),
                normalizeBlank(item.imageUrl()),
                normalizeBlank(item.videoUrl()),
                item.bodyPart(),
                item.target(),
                item.equipment(),
                item.secondaryMuscles() == null ? List.of() : item.secondaryMuscles(),
                item.instructions() == null ? List.of() : item.instructions()
        );
    }

    private String resolveGifUrl(AscendExerciseItemDto item) {
        String gifUrl = normalizeBlank(item.gifUrl());
        if (gifUrl != null) {
            return gifUrl;
        }

        String imageUrl = normalizeBlank(item.imageUrl());
        if (looksLikeGif(imageUrl)) {
            return imageUrl;
        }

        String videoUrl = normalizeBlank(item.videoUrl());
        if (looksLikeGif(videoUrl)) {
            return videoUrl;
        }

        return null;
    }

    private boolean looksLikeGif(String value) {
        if (value == null) {
            return false;
        }
        return value.toLowerCase().contains(".gif");
    }

    private String normalizeBlank(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
