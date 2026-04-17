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
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class WorkoutLogService {

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

    public List<WorkoutLogResponse> listWorkoutLogs(Long userId) {
        return workoutLogRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public WorkoutLogResponse logWorkout(Long userId, CreateWorkoutLogRequest request) {
        if (request == null) {
            throw new ApiException("Workout log request is required");
        }

        if (request.workoutPlanId() != null) {
            workoutPlanRepository.findById(request.workoutPlanId())
                    .filter(workoutPlan -> userId.equals(workoutPlan.getUserId()))
                    .orElseThrow(() -> new NoSuchElementException("Workout plan not found"));
        }

        WorkoutLogEntity workoutLog = new WorkoutLogEntity();
        workoutLog.setUserId(userId);
        workoutLog.setWorkoutPlanId(request.workoutPlanId());
        workoutLog.setCompletedAt(request.completedAt() == null ? Instant.now() : request.completedAt());
        workoutLog.setDurationMinutes(request.durationMinutes());
        workoutLog.setNotes(request.notes());
        workoutLog.setExercises(mapExerciseLogs(request.exercises()));

        return toResponse(workoutLogRepository.save(workoutLog));
    }

    private List<WorkoutExerciseLogEntity> mapExerciseLogs(List<WorkoutLogExerciseRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new ApiException("At least one exercise log is required");
        }

        return requests.stream()
                .map(this::mapExerciseLog)
                .toList();
    }

    private WorkoutExerciseLogEntity mapExerciseLog(WorkoutLogExerciseRequest request) {
        if (request == null) {
            throw new ApiException("Exercise log is required");
        }
        if (request.exerciseId() == null) {
            throw new ApiException("Exercise id is required");
        }
        exerciseCatalogService.getExerciseEntity(request.exerciseId());

        WorkoutExerciseLogEntity exerciseLog = new WorkoutExerciseLogEntity();
        exerciseLog.setExerciseId(request.exerciseId());
        exerciseLog.setSortOrder(request.sortOrder());
        exerciseLog.setSetsCompleted(request.setsCompleted());
        exerciseLog.setRepsCompleted(request.repsCompleted());
        exerciseLog.setWeight(request.weight());
        exerciseLog.setNotes(request.notes());
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
