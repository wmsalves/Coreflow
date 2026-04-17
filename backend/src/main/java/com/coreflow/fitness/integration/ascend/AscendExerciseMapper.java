package com.coreflow.fitness.integration.ascend;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import com.coreflow.fitness.integration.ascend.AscendExerciseDtos.AscendExerciseItemDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AscendExerciseMapper {

    public ExternalExerciseDto toExternalExercise(AscendExerciseItemDto item) {
        return new ExternalExerciseDto(
                item.exerciseId(),
                "ascend",
                item.name(),
                item.imageUrl(),
                item.videoUrl(),
                item.bodyPart(),
                item.target(),
                item.equipment(),
                item.secondaryMuscles() == null ? List.of() : item.secondaryMuscles(),
                item.instructions() == null ? List.of() : item.instructions()
        );
    }
}
