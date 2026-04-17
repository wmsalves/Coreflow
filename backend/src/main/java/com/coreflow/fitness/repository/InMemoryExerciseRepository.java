package com.coreflow.fitness.repository;

import com.coreflow.fitness.entity.ExerciseEntity;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryExerciseRepository implements ExerciseRepository {

    private final AtomicLong idSequence = new AtomicLong(0);
    private final Map<Long, ExerciseEntity> exercises = new ConcurrentHashMap<>();

    public InMemoryExerciseRepository() {
        save(seed("push-up", "local", "Push-up", "strength", "chest", "body weight"));
        save(seed("squat", "local", "Bodyweight Squat", "strength", "quadriceps", "body weight"));
        save(seed("plank", "local", "Plank", "core", "abdominals", "body weight"));
        save(seed("dumbbell-row", "local", "Dumbbell Row", "strength", "back", "dumbbell"));
    }

    @Override
    public List<ExerciseEntity> findAll() {
        return exercises.values().stream()
                .sorted(Comparator.comparing(ExerciseEntity::getName))
                .toList();
    }

    @Override
    public List<ExerciseEntity> search(String query) {
        String normalizedQuery = normalize(query);
        if (normalizedQuery.isBlank()) {
            return findAll();
        }

        return exercises.values().stream()
                .filter(exercise -> contains(exercise.getName(), normalizedQuery)
                        || contains(exercise.getCategory(), normalizedQuery)
                        || contains(exercise.getTargetMuscle(), normalizedQuery)
                        || contains(exercise.getEquipment(), normalizedQuery))
                .sorted(Comparator.comparing(ExerciseEntity::getName))
                .toList();
    }

    @Override
    public Optional<ExerciseEntity> findById(Long id) {
        return Optional.ofNullable(exercises.get(id));
    }

    @Override
    public Optional<ExerciseEntity> findByExternalId(String source, String externalId) {
        return exercises.values().stream()
                .filter(exercise -> normalize(source).equals(normalize(exercise.getSource())))
                .filter(exercise -> normalize(externalId).equals(normalize(exercise.getExternalId())))
                .findFirst();
    }

    @Override
    public ExerciseEntity save(ExerciseEntity exercise) {
        Instant now = Instant.now();
        if (exercise.getId() == null) {
            exercise.setId(idSequence.incrementAndGet());
            exercise.setCreatedAt(now);
        }
        exercise.setUpdatedAt(now);
        exercises.put(exercise.getId(), exercise);
        return exercise;
    }

    @Override
    public List<ExerciseEntity> saveAll(List<ExerciseEntity> exercisesToSave) {
        List<ExerciseEntity> saved = new ArrayList<>();
        for (ExerciseEntity exercise : exercisesToSave) {
            saved.add(save(exercise));
        }
        return saved;
    }

    private ExerciseEntity seed(String externalId, String source, String name, String category, String targetMuscle, String equipment) {
        ExerciseEntity exercise = new ExerciseEntity();
        exercise.setExternalId(externalId);
        exercise.setSource(source);
        exercise.setName(name);
        exercise.setCategory(category);
        exercise.setTargetMuscle(targetMuscle);
        exercise.setEquipment(equipment);
        return exercise;
    }

    private boolean contains(String value, String query) {
        return normalize(value).contains(query);
    }

    private String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
    }
}
