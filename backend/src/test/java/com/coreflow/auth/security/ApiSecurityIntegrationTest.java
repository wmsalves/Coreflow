package com.coreflow.auth.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "ASCEND_API_BASE_URL=https://example.invalid",
                "ASCEND_API_HOST=example.invalid",
                "ASCEND_API_KEY=test-key",
                "coreflow.auth.supabase.url=https://test-project.supabase.co"
        }
)
class ApiSecurityIntegrationTest {

    private static final String USER_A = "11111111-1111-4111-8111-111111111111";
    private static final String USER_B = "22222222-2222-4222-8222-222222222222";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void rejectsMissingToken() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/api/v1/fitness/workout-plans",
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).contains("Authentication required");
    }

    @Test
    void rejectsInvalidToken() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.GET,
                requestWithToken("invalid-token"),
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).contains("Authentication required");
        assertThat(response.getBody()).doesNotContain("invalid-token");
    }

    @Test
    void allowsValidToken() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.GET,
                requestWithToken("token-user-a"),
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("Workout plans loaded");
    }

    @Test
    void scopesWorkoutPlansToAuthenticatedUser() throws Exception {
        ResponseEntity<String> createResponse = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.POST,
                requestWithToken("token-user-a", Map.of(
                        "name", "User A plan",
                        "description", "private"
                )),
                String.class
        );
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        JsonNode createdPlan = objectMapper.readTree(createResponse.getBody()).get("data");
        long planId = createdPlan.get("id").asLong();
        assertThat(createdPlan.get("userId").asText()).isEqualTo(USER_A);

        ResponseEntity<String> userBListResponse = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.GET,
                requestWithToken("token-user-b"),
                String.class
        );
        assertThat(userBListResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(objectMapper.readTree(userBListResponse.getBody()).get("data")).isEmpty();

        ResponseEntity<String> crossUserMutationResponse = restTemplate.exchange(
                "/api/v1/fitness/workout-plans/" + planId + "/exercises",
                HttpMethod.POST,
                requestWithToken("token-user-b", Map.of("exerciseId", 1)),
                String.class
        );
        assertThat(crossUserMutationResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void ignoresClientSuppliedUserIdHeader() throws Exception {
        ResponseEntity<String> createResponse = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.POST,
                requestWithTokenAndUserHeader("token-user-a", USER_B, Map.of(
                        "name", "Header spoof attempt",
                        "description", "must stay with token user"
                )),
                String.class
        );

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode createdPlan = objectMapper.readTree(createResponse.getBody()).get("data");
        assertThat(createdPlan.get("userId").asText()).isEqualTo(USER_A);

        ResponseEntity<String> spoofedListResponse = restTemplate.exchange(
                "/api/v1/fitness/workout-plans",
                HttpMethod.GET,
                requestWithTokenAndUserHeader("token-user-b", USER_A),
                String.class
        );

        assertThat(spoofedListResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(objectMapper.readTree(spoofedListResponse.getBody()).get("data")).isEmpty();
    }

    private HttpEntity<Void> requestWithToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return new HttpEntity<>(headers);
    }

    private HttpEntity<Map<String, Object>> requestWithToken(String token, Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    private HttpEntity<Void> requestWithTokenAndUserHeader(String token, String userId) {
        HttpHeaders headers = headersWithTokenAndUserHeader(token, userId);
        return new HttpEntity<>(headers);
    }

    private HttpEntity<Map<String, Object>> requestWithTokenAndUserHeader(
            String token,
            String userId,
            Map<String, Object> body
    ) {
        HttpHeaders headers = headersWithTokenAndUserHeader(token, userId);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    private HttpHeaders headersWithTokenAndUserHeader(String token, String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.set("X-User-Id", userId);
        return headers;
    }

    @TestConfiguration
    static class JwtDecoderTestConfig {

        @Bean
        @Primary
        JwtDecoder testJwtDecoder() {
            return token -> switch (token) {
                case "token-user-a" -> jwt(token, USER_A);
                case "token-user-b" -> jwt(token, USER_B);
                default -> throw new BadJwtException("Invalid token");
            };
        }

        private Jwt jwt(String token, String subject) {
            Instant now = Instant.now();
            return Jwt.withTokenValue(token)
                    .header("alg", "RS256")
                    .issuer("https://test-project.supabase.co/auth/v1")
                    .audience(List.of("authenticated"))
                    .subject(subject)
                    .claim("role", "authenticated")
                    .issuedAt(now.minusSeconds(60))
                    .expiresAt(now.plusSeconds(3600))
                    .build();
        }
    }
}
