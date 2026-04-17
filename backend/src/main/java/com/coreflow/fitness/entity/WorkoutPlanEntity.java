package com.coreflow.fitness.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class WorkoutPlanEntity {

    private Long id;
    private Long userId;
    private String name;
    private String description;
    private List<WorkoutPlanExerciseEntity> exercises = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<WorkoutPlanExerciseEntity> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutPlanExerciseEntity> exercises) {
        this.exercises = exercises == null ? new ArrayList<>() : new ArrayList<>(exercises);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
