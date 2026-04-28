package com.coreflow.fitness.integration.ascend;

import com.coreflow.fitness.model.Exercise;
import com.coreflow.fitness.service.ExternalExerciseService;
import com.coreflow.fitness.support.ExerciseDataNormalizer;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

@Service
public class AscendExternalExerciseService implements ExternalExerciseService {

    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    private final AscendExerciseClient ascendExerciseClient;
    private final AscendExerciseMapper ascendExerciseMapper;
    private final ConcurrentMap<String, CachedValue<List<Exercise>>> searchCache = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, CachedValue<Optional<Exercise>>> detailCache = new ConcurrentHashMap<>();

    public AscendExternalExerciseService(
            AscendExerciseClient ascendExerciseClient,
            AscendExerciseMapper ascendExerciseMapper
    ) {
        this.ascendExerciseClient = ascendExerciseClient;
        this.ascendExerciseMapper = ascendExerciseMapper;
    }

    @Override
    public List<Exercise> fetchExercises(String query) {
        String cacheKey = ExerciseDataNormalizer.normalizeKey(query);
        CachedValue<List<Exercise>> cachedExercises = searchCache.get(cacheKey);
        if (cachedExercises != null && !cachedExercises.isExpired()) {
            return cachedExercises.value();
        }

        List<Exercise> exercises = ascendExerciseClient.searchExercises(query).data().stream()
                .map(ascendExerciseMapper::toExercise)
                .filter(exercise -> exercise.id() != null && exercise.name() != null)
                .toList();

        searchCache.put(cacheKey, CachedValue.fresh(exercises));
        return exercises;
    }

    @Override
    public Optional<Exercise> fetchExerciseByExternalId(String externalId) {
        String cacheKey = ExerciseDataNormalizer.normalizeKey(externalId);
        CachedValue<Optional<Exercise>> cachedExercise = detailCache.get(cacheKey);
        if (cachedExercise != null && !cachedExercise.isExpired()) {
            return cachedExercise.value();
        }

        Optional<Exercise> exercise = Optional.of(ascendExerciseMapper.toExercise(ascendExerciseClient.getExercise(externalId).data()))
                .filter(candidate -> candidate.id() != null && candidate.name() != null);

        detailCache.put(cacheKey, CachedValue.fresh(exercise));
        return exercise;
    }

    private record CachedValue<T>(T value, Instant expiresAt) {

        private static <T> CachedValue<T> fresh(T value) {
            return new CachedValue<>(value, Instant.now().plus(CACHE_TTL));
        }

        private boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }
}
