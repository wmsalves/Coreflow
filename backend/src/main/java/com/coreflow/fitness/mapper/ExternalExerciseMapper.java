package com.coreflow.fitness.mapper;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import com.coreflow.fitness.entity.ExerciseEntity;
import org.springframework.stereotype.Component;

@Component
public class ExternalExerciseMapper {

    public ExerciseEntity toEntity(ExternalExerciseDto dto) {
        ExerciseEntity entity = new ExerciseEntity();
        entity.setExternalId(dto.externalId());
        entity.setSource(dto.source());
        entity.setName(dto.name());
        entity.setCategory(dto.category());
        entity.setTargetMuscle(dto.targetMuscle());
        entity.setEquipment(dto.equipment());
        entity.setGifUrl(dto.gifUrl());
        entity.setSecondaryMuscles(dto.secondaryMuscles());
        entity.setInstructions(dto.instructions());
        return entity;
    }
}
