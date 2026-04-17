package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.WorkoutPlanEntity;
import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository {

    WorkoutPlanEntity save(WorkoutPlanEntity workoutPlan);

    Optional<WorkoutPlanEntity> findById(Long id);

    List<WorkoutPlanEntity> findByUserId(Long userId);
}
