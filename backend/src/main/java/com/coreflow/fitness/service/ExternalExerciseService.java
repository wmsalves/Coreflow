package com.coreflow.fitness.service;

import com.coreflow.fitness.model.Exercise;
import java.util.List;
import java.util.Optional;

public interface ExternalExerciseService {

    List<Exercise> fetchExercises(String query);

    Optional<Exercise> fetchExerciseByExternalId(String externalId);
}
