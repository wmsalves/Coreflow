package com.coreflow.fitness.mapper;

import com.coreflow.fitness.dto.ExerciseResponse;
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
                entity.getCategory(),
                entity.getTargetMuscle(),
                entity.getEquipment(),
                entity.getGifUrl(),
                new ArrayList<>(entity.getSecondaryMuscles()),
                new ArrayList<>(entity.getInstructions())
        );
    }
}
