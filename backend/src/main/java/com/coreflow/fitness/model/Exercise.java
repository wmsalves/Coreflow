package com.coreflow.fitness.model;

import java.util.List;

public record Exercise(
        String id,
        String name,
        String bodyPart,
        String target,
        String equipment,
        String difficulty,
        String category,
        List<String> muscles,
        String gifUrl,
        String imageUrl,
        String videoUrl,
        String mediaUrl,
        List<String> instructions
) {

    public Exercise {
        muscles = muscles == null ? List.of() : List.copyOf(muscles);
        instructions = instructions == null ? List.of() : List.copyOf(instructions);
    }
}
