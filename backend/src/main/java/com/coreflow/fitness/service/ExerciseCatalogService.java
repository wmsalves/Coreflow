package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.dto.ExerciseDetailResponse;
import com.coreflow.fitness.dto.ExerciseSummaryResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.mapper.ExerciseMapper;
import com.coreflow.fitness.mapper.ExternalExerciseMapper;
import com.coreflow.fitness.repository.ExerciseRepository;
import com.coreflow.common.exception.ApiException;
import com.coreflow.common.exception.ExternalServiceException;
import com.coreflow.common.validation.ApiRequestValidator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class ExerciseCatalogService {

    private static final int MAX_EXTERNAL_ID_LENGTH = 120;
    private static final int MAX_SEARCH_QUERY_LENGTH = 80;
    private static final Pattern EXTERNAL_ID_PATTERN = Pattern.compile("[A-Za-z0-9._:-]+");

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
        String normalizedQuery = ApiRequestValidator.optionalText(query, "Search query", MAX_SEARCH_QUERY_LENGTH);

        return exerciseRepository.search(normalizedQuery).stream()
                .map(exerciseMapper::toResponse)
                .toList();
    }

    public List<ExerciseSummaryResponse> searchExerciseSummaries(String query) {
        String normalizedQuery = ApiRequestValidator.optionalText(query, "Search query", MAX_SEARCH_QUERY_LENGTH);

        if (normalizedQuery == null) {
            return listExerciseSummaries();
        }

        try {
            List<ExerciseEntity> importedExercises = importExternalExerciseEntities(normalizedQuery);
            if (!importedExercises.isEmpty()) {
                return importedExercises.stream()
                        .map(exerciseMapper::toSummaryResponse)
                        .toList();
            }
        } catch (NoSuchElementException | ExternalServiceException exception) {
            // Provider failures should not block the local catalog fallback.
        }

        return exerciseRepository.search(normalizedQuery).stream()
                .map(exerciseMapper::toSummaryResponse)
                .toList();
    }

    public ExerciseResponse getExercise(Long id) {
        return exerciseMapper.toResponse(getExerciseEntity(ApiRequestValidator.requirePositiveLong(id, "Exercise id")));
    }

    public ExerciseDetailResponse getExerciseDetail(String id) {
        String normalizedId = normalizeExternalId(id);
        Optional<ExerciseEntity> existingExercise = findExerciseByCatalogId(normalizedId);
        ExerciseEntity exercise = existingExercise.orElseGet(() -> fetchAndStoreExternalExercise(normalizedId));

        if (existingExercise.isPresent()) {
            enrichExerciseIfAvailable(exercise);
        }

        return exerciseMapper.toDetailResponse(exerciseRepository.save(exercise));
    }

    public ExerciseEntity getExerciseEntity(Long id) {
        return exerciseRepository.findById(ApiRequestValidator.requirePositiveLong(id, "Exercise id"))
                .orElseThrow(() -> new NoSuchElementException("Exercise not found"));
    }

    public List<ExerciseResponse> importExternalExercises(String query) {
        String normalizedQuery = ApiRequestValidator.requireText(query, "Search query", MAX_SEARCH_QUERY_LENGTH);

        return importExternalExerciseEntities(normalizedQuery).stream()
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

    private String normalizeExternalId(String id) {
        String normalizedId = ApiRequestValidator.requireText(id, "Exercise id", MAX_EXTERNAL_ID_LENGTH);

        if (!EXTERNAL_ID_PATTERN.matcher(normalizedId).matches()) {
            throw new ApiException("Exercise id contains unsupported characters");
        }

        return normalizedId;
    }

    private Optional<ExerciseEntity> findExerciseByCatalogId(String id) {
        if (id == null || id.isBlank()) {
            return Optional.empty();
        }

        try {
            Optional<ExerciseEntity> byInternalId = exerciseRepository.findById(Long.parseLong(id));
            if (byInternalId.isPresent()) {
                return byInternalId;
            }
        } catch (NumberFormatException exception) {
            // Non-numeric ids may still be real external provider ids.
        }

        return exerciseRepository.findByExternalId(id)
                .filter(exercise -> !"local".equalsIgnoreCase(exercise.getSource()));
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
        } catch (NoSuchElementException | ExternalServiceException exception) {
            // Search responses may be enough when provider detail is unavailable.
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
