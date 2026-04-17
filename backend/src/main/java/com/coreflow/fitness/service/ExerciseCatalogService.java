package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.mapper.ExerciseMapper;
import com.coreflow.fitness.mapper.ExternalExerciseMapper;
import com.coreflow.fitness.repository.ExerciseRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ExerciseCatalogService {

    private final ExerciseRepository exerciseRepository;
    private final ExternalExerciseService externalExerciseService;
    private final ExerciseMapper exerciseMapper;
    private final ExternalExerciseMapper externalExerciseMapper;

    public ExerciseCatalogService(
            ExerciseRepository exerciseRepository,
            ExternalExerciseService externalExerciseService,
            ExerciseMapper exerciseMapper,
            ExternalExerciseMapper externalExerciseMapper
    ) {
        this.exerciseRepository = exerciseRepository;
        this.externalExerciseService = externalExerciseService;
        this.exerciseMapper = exerciseMapper;
        this.externalExerciseMapper = externalExerciseMapper;
    }

    public List<ExerciseResponse> listExercises() {
        return exerciseRepository.findAll().stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    public List<ExerciseResponse> searchExercises(String query) {
        return exerciseRepository.search(query).stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    public ExerciseResponse getExercise(Long id) {
        return exerciseMapper.toResponse(getExerciseEntity(id));
    }

    public ExerciseEntity getExerciseEntity(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Exercise not found"));
    }

    public List<ExerciseResponse> importExternalExercises(String query) {
        List<ExerciseEntity> normalizedExercises = externalExerciseService.fetchExercises(query).stream()
                .map(externalExerciseMapper::toEntity)
                .map(this::upsertExternalExercise)
                .toList();

        return exerciseRepository.saveAll(normalizedExercises).stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    private ExerciseEntity upsertExternalExercise(ExerciseEntity externalExercise) {
        return exerciseRepository
                .findByExternalId(externalExercise.getSource(), externalExercise.getExternalId())
                .map(existingExercise -> merge(existingExercise, externalExercise))
                .orElse(externalExercise);
    }

    private ExerciseEntity merge(ExerciseEntity existingExercise, ExerciseEntity externalExercise) {
        existingExercise.setName(externalExercise.getName());
        existingExercise.setCategory(externalExercise.getCategory());
        existingExercise.setTargetMuscle(externalExercise.getTargetMuscle());
        existingExercise.setEquipment(externalExercise.getEquipment());
        existingExercise.setGifUrl(externalExercise.getGifUrl());
        existingExercise.setSecondaryMuscles(externalExercise.getSecondaryMuscles());
        existingExercise.setInstructions(externalExercise.getInstructions());
        return existingExercise;
    }
}
