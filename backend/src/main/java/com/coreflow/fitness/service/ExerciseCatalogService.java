package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.dto.ExerciseDetailResponse;
import com.coreflow.fitness.dto.ExerciseSummaryResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.mapper.ExerciseMapper;
import com.coreflow.fitness.mapper.ExternalExerciseMapper;
import com.coreflow.fitness.repository.ExerciseRepository;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
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

    public List<ExerciseSummaryResponse> listExerciseSummaries() {
        return exerciseRepository.findAll().stream()
                .map(exerciseMapper::toSummaryResponse)
                .toList();
    }

    public List<ExerciseResponse> searchExercises(String query) {
        return exerciseRepository.search(query).stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    public List<ExerciseSummaryResponse> searchExerciseSummaries(String query) {
        if (query == null || query.isBlank()) {
            return listExerciseSummaries();
        }

        return importExternalExerciseEntities(query).stream()
                .map(exerciseMapper::toSummaryResponse)
                .toList();
    }

    public ExerciseResponse getExercise(Long id) {
        return exerciseMapper.toResponse(getExerciseEntity(id));
    }

    public ExerciseDetailResponse getExerciseDetail(String id) {
        Optional<ExerciseEntity> existingExercise = findExerciseByCatalogId(id);
        ExerciseEntity exercise = existingExercise.orElseGet(() -> fetchAndStoreExternalExercise(id));

        if (existingExercise.isPresent()) {
            enrichExerciseIfAvailable(exercise);
        }

        return exerciseMapper.toDetailResponse(exerciseRepository.save(exercise));
    }

    public ExerciseEntity getExerciseEntity(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Exercise not found"));
    }

    public List<ExerciseResponse> importExternalExercises(String query) {
        return importExternalExerciseEntities(query).stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    private List<ExerciseEntity> importExternalExerciseEntities(String query) {
        List<ExerciseEntity> normalizedExercises = externalExerciseService.fetchExercises(query).stream()
                .map(externalExerciseMapper::toEntity)
                .map(this::upsertExternalExercise)
                .toList();

        return exerciseRepository.saveAll(normalizedExercises);
    }

    private Optional<ExerciseEntity> findExerciseByCatalogId(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }

        Optional<ExerciseEntity> byExternalId = exerciseRepository.findByExternalId(id);
        if (byExternalId.isPresent()) {
            return byExternalId;
        }

        try {
            return exerciseRepository.findById(Long.parseLong(id));
        } catch (NumberFormatException exception) {
            return Optional.empty();
        }
    }

    private ExerciseEntity fetchAndStoreExternalExercise(String externalId) {
        return externalExerciseService.fetchExerciseByExternalId(externalId)
                .map(externalExerciseMapper::toEntity)
                .map(this::upsertExternalExercise)
                .map(exerciseRepository::save)
                .orElseThrow(() -> new NoSuchElementException("Exercise not found"));
    }

    private void enrichExerciseIfAvailable(ExerciseEntity exercise) {
        if (exercise.getExternalId() == null) {
            return;
        }

        try {
            externalExerciseService.fetchExerciseByExternalId(exercise.getExternalId())
                    .map(externalExerciseMapper::toEntity)
                    .map(this::upsertExternalExercise)
                    .map(exerciseRepository::save)
                    .ifPresent(enrichedExercise -> merge(exercise, enrichedExercise));
        } catch (NoSuchElementException exception) {
            // Search responses may be enough for MVP when provider detail is unavailable.
        }
    }

    private ExerciseEntity upsertExternalExercise(ExerciseEntity externalExercise) {
        return exerciseRepository
                .findByExternalId(externalExercise.getSource(), externalExercise.getExternalId())
                .map(existingExercise -> merge(existingExercise, externalExercise))
                .orElse(externalExercise);
    }

    private ExerciseEntity merge(ExerciseEntity existingExercise, ExerciseEntity externalExercise) {
        existingExercise.setName(externalExercise.getName());
        existingExercise.setImageUrl(externalExercise.getImageUrl());
        existingExercise.setVideoUrl(externalExercise.getVideoUrl());
        existingExercise.setBodyPart(externalExercise.getBodyPart());
        existingExercise.setTarget(externalExercise.getTarget());
        existingExercise.setCategory(externalExercise.getCategory());
        existingExercise.setTargetMuscle(externalExercise.getTargetMuscle());
        existingExercise.setEquipment(externalExercise.getEquipment());
        existingExercise.setGifUrl(externalExercise.getGifUrl());
        existingExercise.setSecondaryMuscles(externalExercise.getSecondaryMuscles());
        existingExercise.setInstructions(externalExercise.getInstructions());
        return existingExercise;
    }
}
