package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.ExerciseEntity;
import java.util.List;
import java.util.Optional;

public interface ExerciseRepository {

    List<ExerciseEntity> findAll();

    List<ExerciseEntity> search(String query);

    Optional<ExerciseEntity> findById(Long id);

    Optional<ExerciseEntity> findByExternalId(String source, String externalId);

    ExerciseEntity save(ExerciseEntity exercise);

    List<ExerciseEntity> saveAll(List<ExerciseEntity> exercises);
}
