package com.coreflow.fitness.integration.ascend;

import com.coreflow.common.exception.ExternalServiceException;
import com.coreflow.fitness.integration.ascend.AscendExerciseDtos.AscendExerciseDetailResponse;
import com.coreflow.fitness.integration.ascend.AscendExerciseDtos.AscendExerciseSearchResponse;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class AscendExerciseClient {

    private final AscendExerciseProperties properties;
    private final RestClient restClient;

    public AscendExerciseClient(AscendExerciseProperties properties, RestClient.Builder restClientBuilder) {
        this.properties = properties;
        this.restClient = restClientBuilder
                .baseUrl(trimTrailingSlash(properties.getBaseUrl()))
                .defaultHeader("x-rapidapi-host", headerValue(properties.getHost()))
                .defaultHeader("x-rapidapi-key", headerValue(properties.getKey()))
                .build();
    }

    public AscendExerciseSearchResponse searchExercises(String query) {
        ensureConfigured();
        try {
            AscendExerciseSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/v1/exercises/search")
                            .queryParam("search", query)
                            .build())
                    .retrieve()
                    .body(AscendExerciseSearchResponse.class);

            if (response == null || !Boolean.TRUE.equals(response.success()) || response.data() == null) {
                throw new ExternalServiceException("Exercise provider returned an invalid search response");
            }

            return response;
        } catch (HttpClientErrorException.NotFound exception) {
            throw new NoSuchElementException("Exercise not found");
        } catch (RestClientException exception) {
            throw new ExternalServiceException("Exercise provider is unavailable", exception);
        }
    }

    public AscendExerciseDetailResponse getExercise(String exerciseId) {
        ensureConfigured();
        try {
            AscendExerciseDetailResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/v1/exercises/{exerciseId}")
                            .build(exerciseId))
                    .retrieve()
                    .body(AscendExerciseDetailResponse.class);

            if (response == null || !Boolean.TRUE.equals(response.success()) || response.data() == null) {
                throw new ExternalServiceException("Exercise provider returned an invalid detail response");
            }

            return response;
        } catch (HttpClientErrorException.NotFound exception) {
            throw new NoSuchElementException("Exercise not found");
        } catch (RestClientException exception) {
            throw new ExternalServiceException("Exercise provider is unavailable", exception);
        }
    }

    private void ensureConfigured() {
        if (!properties.isConfigured()) {
            throw new ExternalServiceException("Exercise provider is not configured");
        }
    }

    private String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private String headerValue(String value) {
        return value == null ? "" : value;
    }
}
