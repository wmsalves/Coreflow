package com.coreflow.fitness.mapper;

import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.dto.ExerciseDetailResponse;
import com.coreflow.fitness.dto.ExerciseSummaryResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import java.util.ArrayList;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    public ExerciseResponse toResponse(ExerciseEntity entity) {
        return new ExerciseResponse(
                entity.getId(),
                entity.getExternalId(),
                entity.getSource(),
                entity.getName(),
                entity.getGifUrl(),
                entity.getImageUrl(),
                entity.getVideoUrl(),
                entity.getBodyPart(),
                entity.getTarget(),
                entity.getCategory(),
                entity.getTargetMuscle(),
                entity.getEquipment(),
                new ArrayList<>(entity.getSecondaryMuscles()),
                new ArrayList<>(entity.getInstructions())
        );
    }

    public ExerciseSummaryResponse toSummaryResponse(ExerciseEntity entity) {
        return new ExerciseSummaryResponse(
                resolveCatalogId(entity),
                entity.getId(),
                entity.getName(),
                entity.getGifUrl(),
                entity.getImageUrl(),
                entity.getVideoUrl(),
                entity.getBodyPart(),
                entity.getTarget(),
                entity.getEquipment()
        );
    }

    public ExerciseDetailResponse toDetailResponse(ExerciseEntity entity) {
        return new ExerciseDetailResponse(
                resolveCatalogId(entity),
                entity.getId(),
                entity.getName(),
                entity.getGifUrl(),
                entity.getImageUrl(),
                entity.getVideoUrl(),
                entity.getBodyPart(),
                entity.getTarget(),
                entity.getEquipment(),
                new ArrayList<>(entity.getSecondaryMuscles()),
                new ArrayList<>(entity.getInstructions())
        );
    }

    private String resolveCatalogId(ExerciseEntity entity) {
        if (entity.getExternalId() != null
                && !entity.getExternalId().isBlank()
                && !"local".equalsIgnoreCase(entity.getSource())) {
            return entity.getExternalId();
        }
        if (entity.getId() != null) {
            return String.valueOf(entity.getId());
        }
        if (entity.getExternalId() != null && !entity.getExternalId().isBlank()) {
            return entity.getExternalId();
        }
        return "";
    }
}
