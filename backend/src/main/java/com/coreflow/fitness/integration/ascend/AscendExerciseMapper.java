package com.coreflow.fitness.integration.ascend;

import com.coreflow.fitness.integration.ascend.AscendExerciseDtos.AscendExerciseItemDto;
import com.coreflow.fitness.model.Exercise;
import com.coreflow.fitness.support.ExerciseDataNormalizer;
import org.springframework.stereotype.Component;

@Component
public class AscendExerciseMapper {

    public Exercise toExercise(AscendExerciseItemDto item) {
        String gifUrl = resolveGifUrl(item);
        String imageUrl = ExerciseDataNormalizer.cleanUrl(item.imageUrl());
        String videoUrl = ExerciseDataNormalizer.cleanUrl(item.videoUrl());

        return new Exercise(
                ExerciseDataNormalizer.cleanText(item.exerciseId()),
                ExerciseDataNormalizer.cleanName(item.name()),
                ExerciseDataNormalizer.cleanLabel(item.bodyPart()),
                ExerciseDataNormalizer.cleanLabel(item.target()),
                ExerciseDataNormalizer.cleanLabel(item.equipment()),
                null,
                null,
                ExerciseDataNormalizer.cleanInstructions(item.secondaryMuscles()),
                gifUrl,
                imageUrl,
                videoUrl,
                ExerciseDataNormalizer.resolveMediaUrl(gifUrl, imageUrl, videoUrl),
                ExerciseDataNormalizer.cleanInstructions(item.instructions())
        );
    }

    private String resolveGifUrl(AscendExerciseItemDto item) {
        String gifUrl = ExerciseDataNormalizer.cleanUrl(item.gifUrl());
        if (gifUrl != null) {
            return gifUrl;
        }

        String imageUrl = ExerciseDataNormalizer.cleanUrl(item.imageUrl());
        if (looksLikeGif(imageUrl)) {
            return imageUrl;
        }

        String videoUrl = ExerciseDataNormalizer.cleanUrl(item.videoUrl());
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
}
