package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.WorkoutPlanEntity;
import com.coreflow.fitness.entity.WorkoutPlanExerciseEntity;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryWorkoutPlanRepository implements WorkoutPlanRepository {

    private final AtomicLong planIdSequence = new AtomicLong(0);
    private final AtomicLong planExerciseIdSequence = new AtomicLong(0);
    private final Map<Long, WorkoutPlanEntity> workoutPlans = new ConcurrentHashMap<>();

    @Override
    public WorkoutPlanEntity save(WorkoutPlanEntity workoutPlan) {
        Instant now = Instant.now();
        if (workoutPlan.getId() == null) {
            workoutPlan.setId(planIdSequence.incrementAndGet());
            workoutPlan.setCreatedAt(now);
        }
        workoutPlan.setUpdatedAt(now);
        for (WorkoutPlanExerciseEntity exercise : workoutPlan.getExercises()) {
            if (exercise.getId() == null) {
                exercise.setId(planExerciseIdSequence.incrementAndGet());
            }
        }
        workoutPlans.put(workoutPlan.getId(), workoutPlan);
        return workoutPlan;
    }

    @Override
    public Optional<WorkoutPlanEntity> findById(Long id) {
        return Optional.ofNullable(workoutPlans.get(id));
    }

    @Override
    public List<WorkoutPlanEntity> findByUserId(String userId) {
        return workoutPlans.values().stream()
                .filter(workoutPlan -> userId.equals(workoutPlan.getUserId()))
                .sorted(Comparator.comparing(WorkoutPlanEntity::getUpdatedAt).reversed())
                .toList();
    }
}
