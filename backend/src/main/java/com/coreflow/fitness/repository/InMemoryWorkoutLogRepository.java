package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.WorkoutLogEntity;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryWorkoutLogRepository implements WorkoutLogRepository {

    private final AtomicLong idSequence = new AtomicLong(0);
    private final Map<Long, WorkoutLogEntity> workoutLogs = new ConcurrentHashMap<>();

    @Override
    public WorkoutLogEntity save(WorkoutLogEntity workoutLog) {
        if (workoutLog.getId() == null) {
            workoutLog.setId(idSequence.incrementAndGet());
        }
        workoutLogs.put(workoutLog.getId(), workoutLog);
        return workoutLog;
    }

    @Override
    public Optional<WorkoutLogEntity> findById(Long id) {
        return Optional.ofNullable(workoutLogs.get(id));
    }

    @Override
    public List<WorkoutLogEntity> findByUserId(Long userId) {
        return workoutLogs.values().stream()
                .filter(workoutLog -> userId.equals(workoutLog.getUserId()))
                .sorted(Comparator.comparing(WorkoutLogEntity::getCompletedAt).reversed())
                .toList();
    }
}
