package com.coreflow.fitness.integration.ascend;

import com.coreflow.fitness.dto.ExternalExerciseDto;
import com.coreflow.fitness.service.ExternalExerciseService;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class AscendExternalExerciseService implements ExternalExerciseService {

    private final AscendExerciseClient ascendExerciseClient;
    private final AscendExerciseMapper ascendExerciseMapper;

    public AscendExternalExerciseService(
            AscendExerciseClient ascendExerciseClient,
            AscendExerciseMapper ascendExerciseMapper
    ) {
        this.ascendExerciseClient = ascendExerciseClient;
        this.ascendExerciseMapper = ascendExerciseMapper;
    }

    @Override
    public List<ExternalExerciseDto> fetchExercises(String query) {
        return ascendExerciseClient.searchExercises(query).data().stream()
                .map(ascendExerciseMapper::toExternalExercise)
                .toList();
    }

    @Override
    public Optional<ExternalExerciseDto> fetchExerciseByExternalId(String externalId) {
        return Optional.of(ascendExerciseMapper.toExternalExercise(ascendExerciseClient.getExercise(externalId).data()));
    }
}
