package com.coreflow.fitness.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class WorkoutLogEntity {

    private Long id;
    private Long userId;
    private Long workoutPlanId;
    private Instant completedAt;
    private Integer durationMinutes;
    private String notes;
    private List<WorkoutExerciseLogEntity> exercises = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getWorkoutPlanId() {
        return workoutPlanId;
    }

    public void setWorkoutPlanId(Long workoutPlanId) {
        this.workoutPlanId = workoutPlanId;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<WorkoutExerciseLogEntity> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExerciseLogEntity> exercises) {
        this.exercises = exercises == null ? new ArrayList<>() : new ArrayList<>(exercises);
    }
}
