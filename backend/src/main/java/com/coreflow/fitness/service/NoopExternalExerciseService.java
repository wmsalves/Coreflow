package com.coreflow.fitness.service;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import java.util.List;
import java.util.Optional;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "coreflow.fitness.exercise-provider.enabled", havingValue = "false", matchIfMissing = true)
public class NoopExternalExerciseService implements ExternalExerciseService {

    @Override
    public List<ExternalExerciseDto> fetchExercises(String query) {
        return List.of();
    }

    @Override
    public Optional<ExternalExerciseDto> fetchExerciseByExternalId(String externalId) {
        return Optional.empty();
    }
}
