package com.coreflow.fitness.model;

import java.util.List;

public record ExerciseEnrichment(
        String difficulty,
        String category,
        String equipment,
        List<String> muscles
) {

    public ExerciseEnrichment {
        muscles = muscles == null ? List.of() : List.copyOf(muscles);
    }
}
