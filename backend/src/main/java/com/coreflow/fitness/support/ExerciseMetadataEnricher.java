package com.coreflow.fitness.support;

import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.model.Exercise;
import com.coreflow.fitness.model.ExerciseEnrichment;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMetadataEnricher {

    private static final String BODYWEIGHT = "Bodyweight";
    private static final String DEFAULT_CATEGORY = "Strength";
    private static final String DEFAULT_DIFFICULTY = "Medium";
    private static final String DEFAULT_MUSCLE = "Full Body";

    private static final List<String> HIGH_DIFFICULTY_KEYWORDS = List.of(
            "advanced",
            "burpee",
            "clean",
            "handstand",
            "jump",
            "muscle up",
            "plyo",
            "pistol",
            "power",
            "snatch",
            "sprint"
    );
    private static final List<String> LOW_DIFFICULTY_KEYWORDS = List.of(
            "beginner",
            "mobility",
            "stretch",
            "walk",
            "warm up",
            "yoga"
    );
    private static final List<String> CARDIO_KEYWORDS = List.of(
            "bike",
            "burpee",
            "cardio",
            "cycling",
            "jump",
            "run",
            "sprint",
            "treadmill"
    );
    private static final List<String> MOBILITY_KEYWORDS = List.of(
            "mobility",
            "stretch",
            "warm up",
            "yoga"
    );
    private static final List<String> CORE_KEYWORDS = List.of(
            "ab",
            "abdominal",
            "core",
            "crunch",
            "plank"
    );
    private static final List<String> CANONICAL_CATEGORIES = List.of(
            "balance",
            "cardio",
            "core",
            "mobility",
            "power",
            "strength"
    );

    public ExerciseEnrichment enrich(ExerciseEntity exercise) {
        String name = ExerciseDataNormalizer.cleanName(exercise.getName());
        String bodyPart = ExerciseDataNormalizer.cleanLabel(exercise.getBodyPart());
        String target = ExerciseDataNormalizer.cleanLabel(exercise.getTarget());
        String category = resolveCategory(exercise.getCategory(), deriveCategory(name, bodyPart, target));
        String equipment = firstCleanLabel(exercise.getEquipment(), deriveEquipment(name));
        String difficulty = deriveDifficulty(name, bodyPart, target);
        List<String> muscles = deriveMuscles(exercise.getSecondaryMuscles(), bodyPart, target, name);

        return new ExerciseEnrichment(
                difficulty == null ? DEFAULT_DIFFICULTY : difficulty,
                category == null ? DEFAULT_CATEGORY : category,
                equipment == null ? BODYWEIGHT : equipment,
                muscles.isEmpty() ? List.of(DEFAULT_MUSCLE) : muscles
        );
    }

    public ExerciseEnrichment enrich(Exercise exercise) {
        String name = ExerciseDataNormalizer.cleanName(exercise.name());
        String bodyPart = ExerciseDataNormalizer.cleanLabel(exercise.bodyPart());
        String target = ExerciseDataNormalizer.cleanLabel(exercise.target());
        String category = resolveCategory(exercise.category(), deriveCategory(name, bodyPart, target));
        String equipment = firstCleanLabel(exercise.equipment(), deriveEquipment(name));
        String difficulty = firstCleanLabel(exercise.difficulty(), deriveDifficulty(name, bodyPart, target));
        List<String> muscles = deriveMuscles(exercise.muscles(), bodyPart, target, name);

        return new ExerciseEnrichment(
                difficulty == null ? DEFAULT_DIFFICULTY : difficulty,
                category == null ? DEFAULT_CATEGORY : category,
                equipment == null ? BODYWEIGHT : equipment,
                muscles.isEmpty() ? List.of(DEFAULT_MUSCLE) : muscles
        );
    }

    private String deriveCategory(String name, String bodyPart, String target) {
        String haystack = joinedKey(name, bodyPart, target);
        if (containsAny(haystack, MOBILITY_KEYWORDS)) {
            return "Mobility";
        }
        if (containsAny(haystack, CARDIO_KEYWORDS)) {
            return "Cardio";
        }
        if (containsAny(haystack, CORE_KEYWORDS)) {
            return "Core";
        }
        return DEFAULT_CATEGORY;
    }

    private String deriveDifficulty(String name, String bodyPart, String target) {
        String haystack = joinedKey(name, bodyPart, target);
        if (containsAny(haystack, HIGH_DIFFICULTY_KEYWORDS)) {
            return "High";
        }
        if (containsAny(haystack, LOW_DIFFICULTY_KEYWORDS)) {
            return "Low";
        }
        return DEFAULT_DIFFICULTY;
    }

    private String deriveEquipment(String name) {
        String haystack = ExerciseDataNormalizer.normalizeKey(name);
        if (haystack.contains("barbell")) {
            return "Barbell";
        }
        if (haystack.contains("dumbbell")) {
            return "Dumbbell";
        }
        if (haystack.contains("kettlebell")) {
            return "Kettlebell";
        }
        if (haystack.contains("cable")) {
            return "Cable";
        }
        if (haystack.contains("band")) {
            return "Resistance Band";
        }
        if (haystack.contains("machine") || haystack.contains("treadmill") || haystack.contains("bike")) {
            return "Machine";
        }
        if (haystack.contains("medicine ball")) {
            return "Medicine Ball";
        }
        return BODYWEIGHT;
    }

    private List<String> deriveMuscles(List<String> providerMuscles, String bodyPart, String target, String name) {
        Set<String> muscles = new LinkedHashSet<>();
        if (providerMuscles != null) {
            for (String muscle : providerMuscles) {
                addCleanLabel(muscles, muscle);
            }
        }
        addCleanLabel(muscles, target);
        addCleanLabel(muscles, deriveMuscleFromName(name));
        addCleanLabel(muscles, bodyPart);
        return List.copyOf(muscles);
    }

    private String deriveMuscleFromName(String name) {
        String haystack = ExerciseDataNormalizer.normalizeKey(name);
        if (haystack.contains("squat") || haystack.contains("lunge") || haystack.contains("leg press")) {
            return "Quadriceps";
        }
        if (haystack.contains("deadlift") || haystack.contains("hip thrust")) {
            return "Glutes";
        }
        if (haystack.contains("push up") || haystack.contains("bench") || haystack.contains("press")) {
            return "Chest";
        }
        if (haystack.contains("row") || haystack.contains("pull up") || haystack.contains("pulldown")) {
            return "Back";
        }
        if (haystack.contains("curl")) {
            return "Biceps";
        }
        if (haystack.contains("tricep") || haystack.contains("dip")) {
            return "Triceps";
        }
        if (containsAny(haystack, CORE_KEYWORDS)) {
            return "Core";
        }
        return null;
    }

    private void addCleanLabel(Set<String> values, String value) {
        String cleaned = ExerciseDataNormalizer.cleanLabel(value);
        if (cleaned != null) {
            values.add(cleaned);
        }
    }

    private String firstCleanLabel(String preferred, String fallback) {
        String cleaned = ExerciseDataNormalizer.cleanLabel(preferred);
        return cleaned == null ? ExerciseDataNormalizer.cleanLabel(fallback) : cleaned;
    }

    private String resolveCategory(String preferred, String fallback) {
        String cleaned = ExerciseDataNormalizer.cleanLabel(preferred);
        if (cleaned != null && CANONICAL_CATEGORIES.contains(ExerciseDataNormalizer.normalizeKey(cleaned))) {
            return cleaned;
        }
        return ExerciseDataNormalizer.cleanLabel(fallback);
    }

    private String joinedKey(String name, String bodyPart, String target) {
        return ExerciseDataNormalizer.normalizeKey(String.join(" ", List.of(
                name == null ? "" : name,
                bodyPart == null ? "" : bodyPart,
                target == null ? "" : target
        )));
    }

    private boolean containsAny(String haystack, List<String> needles) {
        for (String needle : needles) {
            if (haystack.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
