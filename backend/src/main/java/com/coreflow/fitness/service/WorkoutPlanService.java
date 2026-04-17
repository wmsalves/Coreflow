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
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import org.springframework.stereotype.Service;

@Service
public class WorkoutPlanService {

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

    public List<WorkoutPlanResponse> listWorkoutPlans(Long userId) {
        return workoutPlanRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkoutPlanResponse createWorkoutPlan(Long userId, CreateWorkoutPlanRequest request) {
        if (request == null) {
            throw new ApiException("Workout plan request is required");
        }
        if (request.name() == null || request.name().isBlank()) {
            throw new ApiException("Workout plan name is required");
        }

        WorkoutPlanEntity workoutPlan = new WorkoutPlanEntity();
        workoutPlan.setUserId(userId);
        workoutPlan.setName(request.name().trim());
        workoutPlan.setDescription(request.description());

        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    public WorkoutPlanResponse addExercise(Long userId, Long workoutPlanId, AddExerciseRequest request) {
        if (request == null) {
            throw new ApiException("Exercise request is required");
        }
        if (request.exerciseId() == null) {
            throw new ApiException("Exercise id is required");
        }

        WorkoutPlanEntity workoutPlan = getUserWorkoutPlan(userId, workoutPlanId);
        ExerciseEntity exercise = exerciseCatalogService.getExerciseEntity(request.exerciseId());

        WorkoutPlanExerciseEntity planExercise = new WorkoutPlanExerciseEntity();
        planExercise.setExerciseId(exercise.getId());
        planExercise.setSortOrder(resolveSortOrder(workoutPlan, request.sortOrder()));
        planExercise.setSets(request.sets());
        planExercise.setReps(request.reps());
        planExercise.setRestSeconds(request.restSeconds());
        planExercise.setDurationSeconds(request.durationSeconds());
        planExercise.setNotes(request.notes());

        workoutPlan.getExercises().add(planExercise);
        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    public WorkoutPlanResponse removeExercise(Long userId, Long workoutPlanId, Long exerciseId) {
        WorkoutPlanEntity workoutPlan = getUserWorkoutPlan(userId, workoutPlanId);
        boolean removed = workoutPlan.getExercises().removeIf(exercise -> exerciseId.equals(exercise.getExerciseId()));
        if (!removed) {
            throw new NoSuchElementException("Workout plan exercise not found");
        }

        return toResponse(workoutPlanRepository.save(workoutPlan));
    }

    private WorkoutPlanEntity getUserWorkoutPlan(Long userId, Long workoutPlanId) {
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
