package com.coreflow.fitness.service;

import com.coreflow.common.exception.ApiException;
import com.coreflow.fitness.dto.AddExerciseRequest;
import com.coreflow.fitness.dto.CreateWorkoutPlanRequest;
import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.dto.WorkoutPlanExerciseResponse;
import com.coreflow.fitness.dto.WorkoutPlanResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.entity.WorkoutPlanEntity;
import com.coreflow.fitness.entity.WorkoutPlanExerciseEntity;
import com.coreflow.fitness.mapper.ExerciseMapper;
import com.coreflow.fitness.repository.WorkoutPlanRepository;
import com.coreflow.common.validation.ApiRequestValidator;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class WorkoutPlanService {

    private static final int MAX_DESCRIPTION_LENGTH = 1000;
    private static final int MAX_NAME_LENGTH = 120;
    private static final int MAX_NOTES_LENGTH = 1000;

    private final WorkoutPlanRepository workoutPlanRepository;
    private final ExerciseCatalogService exerciseCatalogService;
    private final ExerciseMapper exerciseMapper;

    public WorkoutPlanService(
            WorkoutPlanRepository workoutPlanRepository,
            ExerciseCatalogService exerciseCatalogService,
            ExerciseMapper exerciseMapper
    ) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.exerciseCatalogService = exerciseCatalogService;
        this.exerciseMapper = exerciseMapper;
    }

    public List<WorkoutPlanResponse> listWorkoutPlans(String userId) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);

        return workoutPlanRepository.findByUserId(normalizedUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkoutPlanResponse createWorkoutPlan(String userId, CreateWorkoutPlanRequest request) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);
        if (request == null) {
            throw new ApiException("Workout plan request is required");
        }

        String name = ApiRequestValidator.requireText(request.name(), "Workout plan name", MAX_NAME_LENGTH);
        String description = ApiRequestValidator.optionalText(
                request.description(),
                "Workout plan description",
                MAX_DESCRIPTION_LENGTH
        );

        WorkoutPlanEntity workoutPlan = new WorkoutPlanEntity();
        workoutPlan.setUserId(normalizedUserId);
        workoutPlan.setName(name);
        workoutPlan.setDescription(description);

        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    public WorkoutPlanResponse addExercise(String userId, Long workoutPlanId, AddExerciseRequest request) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);
        Long normalizedWorkoutPlanId = ApiRequestValidator.requirePositiveLong(workoutPlanId, "Workout plan id");
        if (request == null) {
            throw new ApiException("Exercise request is required");
        }

        Long exerciseId = ApiRequestValidator.requirePositiveLong(request.exerciseId(), "Exercise id");
        WorkoutPlanEntity workoutPlan = getUserWorkoutPlan(normalizedUserId, normalizedWorkoutPlanId);
        ExerciseEntity exercise = exerciseCatalogService.getExerciseEntity(exerciseId);

        WorkoutPlanExerciseEntity planExercise = new WorkoutPlanExerciseEntity();
        planExercise.setExerciseId(exercise.getId());
        planExercise.setSortOrder(resolveSortOrder(
                workoutPlan,
                ApiRequestValidator.optionalIntegerRange(request.sortOrder(), "Sort order", 0, 1000)
        ));
        planExercise.setSets(ApiRequestValidator.optionalIntegerRange(request.sets(), "Sets", 1, 100));
        planExercise.setReps(ApiRequestValidator.optionalIntegerRange(request.reps(), "Reps", 1, 1000));
        planExercise.setRestSeconds(ApiRequestValidator.optionalIntegerRange(request.restSeconds(), "Rest seconds", 0, 86400));
        planExercise.setDurationSeconds(ApiRequestValidator.optionalIntegerRange(
                request.durationSeconds(),
                "Duration seconds",
                0,
                86400
        ));
        planExercise.setNotes(ApiRequestValidator.optionalText(request.notes(), "Exercise notes", MAX_NOTES_LENGTH));

        workoutPlan.getExercises().add(planExercise);
        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    public WorkoutPlanResponse removeExercise(String userId, Long workoutPlanId, Long exerciseId) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);
        Long normalizedWorkoutPlanId = ApiRequestValidator.requirePositiveLong(workoutPlanId, "Workout plan id");
        Long normalizedExerciseId = ApiRequestValidator.requirePositiveLong(exerciseId, "Exercise id");
        WorkoutPlanEntity workoutPlan = getUserWorkoutPlan(normalizedUserId, normalizedWorkoutPlanId);
        boolean removed = workoutPlan.getExercises().removeIf(exercise -> normalizedExerciseId.equals(exercise.getExerciseId()));
        if (!removed) {
            throw new NoSuchElementException("Workout plan exercise not found");
        }

        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    private WorkoutPlanEntity getUserWorkoutPlan(String userId, Long workoutPlanId) {
        return workoutPlanRepository.findById(workoutPlanId)
                .filter(workoutPlan -> userId.equals(workoutPlan.getUserId()))
                .orElseThrow(() -> new NoSuchElementException("Workout plan not found"));
    }

    private int resolveSortOrder(WorkoutPlanEntity workoutPlan, Integer requestedSortOrder) {
        if (requestedSortOrder != null) {
            return requestedSortOrder;
        }

        return workoutPlan.getExercises().stream()
                .map(WorkoutPlanExerciseEntity::getSortOrder)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }

    private WorkoutPlanResponse toResponse(WorkoutPlanEntity entity) {
        List<WorkoutPlanExerciseResponse> exercises = entity.getExercises().stream()
                .sorted(Comparator.comparing(WorkoutPlanExerciseEntity::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(this::toPlanExerciseResponse)
                .toList();

        return new WorkoutPlanResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getName(),
                entity.getDescription(),
                exercises,
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    private WorkoutPlanExerciseResponse toPlanExerciseResponse(WorkoutPlanExerciseEntity entity) {
        ExerciseResponse exercise = exerciseMapper.toResponse(exerciseCatalogService.getExerciseEntity(entity.getExerciseId()));
        return new WorkoutPlanExerciseResponse(
                entity.getId(),
                entity.getExerciseId(),
                exercise,
                entity.getSortOrder(),
                entity.getSets(),
                entity.getReps(),
                entity.getRestSeconds(),
                entity.getDurationSeconds(),
                entity.getNotes()
        );
    }
}
