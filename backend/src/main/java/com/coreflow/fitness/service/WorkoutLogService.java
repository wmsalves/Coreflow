package com.coreflow.fitness.service;

import com.coreflow.common.exception.ApiException;
import com.coreflow.fitness.dto.CreateWorkoutLogRequest;
import com.coreflow.fitness.dto.WorkoutLogExerciseRequest;
import com.coreflow.fitness.dto.WorkoutLogExerciseResponse;
import com.coreflow.fitness.dto.WorkoutLogResponse;
import com.coreflow.fitness.entity.WorkoutExerciseLogEntity;
import com.coreflow.fitness.entity.WorkoutLogEntity;
import com.coreflow.fitness.repository.WorkoutLogRepository;
import com.coreflow.fitness.repository.WorkoutPlanRepository;
import com.coreflow.common.validation.ApiRequestValidator;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class WorkoutLogService {

    private static final int MAX_EXERCISE_LOGS = 50;
    private static final int MAX_NOTES_LENGTH = 1000;

    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final ExerciseCatalogService exerciseCatalogService;

    public WorkoutLogService(
            WorkoutLogRepository workoutLogRepository,
            WorkoutPlanRepository workoutPlanRepository,
            ExerciseCatalogService exerciseCatalogService
    ) {
        this.workoutLogRepository = workoutLogRepository;
        this.workoutPlanRepository = workoutPlanRepository;
        this.exerciseCatalogService = exerciseCatalogService;
    }

    public List<WorkoutLogResponse> listWorkoutLogs(String userId) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);

        return workoutLogRepository.findByUserId(normalizedUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkoutLogResponse logWorkout(String userId, CreateWorkoutLogRequest request) {
        String normalizedUserId = ApiRequestValidator.requireUserId(userId);
        if (request == null) {
            throw new ApiException("Workout log request is required");
        }

        Long workoutPlanId = null;
        if (request.workoutPlanId() != null) {
            workoutPlanId = ApiRequestValidator.requirePositiveLong(request.workoutPlanId(), "Workout plan id");
            workoutPlanRepository.findById(workoutPlanId)
                    .filter(workoutPlan -> normalizedUserId.equals(workoutPlan.getUserId()))
                    .orElseThrow(() -> new NoSuchElementException("Workout plan not found"));
        }

        WorkoutLogEntity workoutLog = new WorkoutLogEntity();
        workoutLog.setUserId(normalizedUserId);
        workoutLog.setWorkoutPlanId(workoutPlanId);
        workoutLog.setCompletedAt(request.completedAt() == null ? Instant.now() : request.completedAt());
        workoutLog.setDurationMinutes(ApiRequestValidator.optionalIntegerRange(
                request.durationMinutes(),
                "Duration minutes",
                0,
                1440
        ));
        workoutLog.setNotes(ApiRequestValidator.optionalText(request.notes(), "Workout notes", MAX_NOTES_LENGTH));
        workoutLog.setExercises(mapExerciseLogs(request.exercises()));

        return toResponse(workoutLogRepository.save(workoutLog));
    }

    private List<WorkoutExerciseLogEntity> mapExerciseLogs(List<WorkoutLogExerciseRequest> requests) {
        return ApiRequestValidator.requireList("Exercise logs", requests, MAX_EXERCISE_LOGS).stream()
                .map(this::mapExerciseLog)
                .toList();
    }

    private WorkoutExerciseLogEntity mapExerciseLog(WorkoutLogExerciseRequest request) {
        if (request == null) {
            throw new ApiException("Exercise log is required");
        }
        Long exerciseId = ApiRequestValidator.requirePositiveLong(request.exerciseId(), "Exercise id");
        exerciseCatalogService.getExerciseEntity(exerciseId);

        WorkoutExerciseLogEntity exerciseLog = new WorkoutExerciseLogEntity();
        exerciseLog.setExerciseId(exerciseId);
        exerciseLog.setSortOrder(ApiRequestValidator.optionalIntegerRange(request.sortOrder(), "Sort order", 0, 1000));
        exerciseLog.setSetsCompleted(ApiRequestValidator.optionalIntegerRange(request.setsCompleted(), "Sets completed", 0, 100));
        exerciseLog.setRepsCompleted(ApiRequestValidator.optionalIntegerRange(request.repsCompleted(), "Reps completed", 0, 1000));
        exerciseLog.setWeight(ApiRequestValidator.optionalDoubleRange(request.weight(), "Weight", 0, 10000));
        exerciseLog.setNotes(ApiRequestValidator.optionalText(request.notes(), "Exercise log notes", MAX_NOTES_LENGTH));
        return exerciseLog;
    }

    private WorkoutLogResponse toResponse(WorkoutLogEntity entity) {
        List<WorkoutLogExerciseResponse> exercises = entity.getExercises().stream()
                .sorted(Comparator.comparing(WorkoutExerciseLogEntity::getSortOrder, Comparator.nullsLast(Integer::compareTo)))
                .map(exercise -> new WorkoutLogExerciseResponse(
                        exercise.getExerciseId(),
                        exercise.getSortOrder(),
                        exercise.getSetsCompleted(),
                        exercise.getRepsCompleted(),
                        exercise.getWeight(),
                        exercise.getNotes()
                ))
                .toList();

        return new WorkoutLogResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getWorkoutPlanId(),
                entity.getCompletedAt(),
                entity.getDurationMinutes(),
                entity.getNotes(),
                exercises
        );
    }
}
