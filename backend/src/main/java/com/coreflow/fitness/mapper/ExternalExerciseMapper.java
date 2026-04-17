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
        entity.setImageUrl(dto.imageUrl());
        entity.setVideoUrl(dto.videoUrl());
        entity.setBodyPart(dto.bodyPart());
        entity.setTarget(dto.target());
        entity.setCategory(dto.bodyPart());
        entity.setTargetMuscle(dto.target());
        entity.setEquipment(dto.equipment());
        entity.setGifUrl(dto.imageUrl());
        entity.setSecondaryMuscles(dto.secondaryMuscles());
        entity.setInstructions(dto.instructions());
        return entity;
    }
}
