package com.coreflow.fitness.entity;

public class WorkoutExerciseLogEntity {

    private Long exerciseId;
    private Integer sortOrder;
    private Integer setsCompleted;
    private Integer repsCompleted;
    private Double weight;
    private String notes;

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getSetsCompleted() {
        return setsCompleted;
    }

    public void setSetsCompleted(Integer setsCompleted) {
        this.setsCompleted = setsCompleted;
    }

    public Integer getRepsCompleted() {
        return repsCompleted;
    }

    public void setRepsCompleted(Integer repsCompleted) {
        this.repsCompleted = repsCompleted;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
