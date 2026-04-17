package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.WorkoutLogEntity;
import java.util.List;
import java.util.Optional;

public interface WorkoutLogRepository {

    WorkoutLogEntity save(WorkoutLogEntity workoutLog);

    Optional<WorkoutLogEntity> findById(Long id);

    List<WorkoutLogEntity> findByUserId(Long userId);
}
