package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import java.util.List;
import java.util.Optional;

public interface ExternalExerciseService {

    List<ExternalExerciseDto> fetchExercises(String query);

    Optional<ExternalExerciseDto> fetchExerciseByExternalId(String externalId);
}
