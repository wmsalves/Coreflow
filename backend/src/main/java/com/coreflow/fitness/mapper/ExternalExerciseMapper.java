package com.coreflow.fitness.mapper;

import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.model.Exercise;
import org.springframework.stereotype.Component;

@Component
public class ExternalExerciseMapper {

    private static final String SOURCE = "ascend";

    public ExerciseEntity toEntity(Exercise exercise) {
        ExerciseEntity entity = new ExerciseEntity();
        entity.setExternalId(exercise.id());
        entity.setSource(SOURCE);
        entity.setName(exercise.name());
        entity.setImageUrl(exercise.imageUrl());
        entity.setGifUrl(exercise.gifUrl());
        entity.setVideoUrl(exercise.videoUrl());
        entity.setBodyPart(exercise.bodyPart());
        entity.setTarget(exercise.target());
        entity.setCategory(exercise.category());
        entity.setTargetMuscle(exercise.target());
        entity.setEquipment(exercise.equipment());
        entity.setSecondaryMuscles(exercise.muscles());
        entity.setInstructions(exercise.instructions());
        return entity;
    }
}
