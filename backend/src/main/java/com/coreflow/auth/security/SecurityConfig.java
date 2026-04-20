package com.coreflow.auth.security;

import com.coreflow.common.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;

@Configuration
public class SecurityConfig {

    private static final String AUTHENTICATED_ROLE = "authenticated";

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationEntryPoint authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler
    ) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().denyAll())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(supabaseAuthenticationConverter())))
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(SupabaseJwtProperties properties) {
        String issuer = properties.issuer();
        NimbusJwtDecoder decoder = createJwtDecoder(properties);

        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer),
                this::validateSupabaseAccessToken
        );
        decoder.setJwtValidator(validator);
        return decoder;
    }

    private Converter<Jwt, AbstractAuthenticationToken> supabaseAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();

        return jwt -> {
            List<GrantedAuthority> authorities = List.copyOf(authoritiesConverter.convert(jwt));
            AuthenticatedSupabaseUser principal = AuthenticatedSupabaseUser.fromJwt(jwt);
            return new UsernamePasswordAuthenticationToken(principal, null, authorities);
        };
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, exception) ->
                writeErrorResponse(response, objectMapper, HttpStatus.UNAUTHORIZED, "Authentication required");
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
        return (request, response, exception) ->
                writeErrorResponse(response, objectMapper, HttpStatus.FORBIDDEN, "Access denied");
    }

    private OAuth2TokenValidatorResult validateSupabaseAccessToken(Jwt jwt) {
        String subject = jwt.getSubject();
        if (subject == null || subject.isBlank()) {
            return invalid("missing_subject", "Token subject is required");
        }

        try {
            UUID.fromString(subject);
        } catch (IllegalArgumentException exception) {
            return invalid("invalid_subject", "Token subject must be a UUID");
        }

        if (!jwt.getAudience().contains(AUTHENTICATED_ROLE)) {
            return invalid("invalid_audience", "Token audience is not accepted");
        }

        if (!AUTHENTICATED_ROLE.equals(jwt.getClaimAsString("role"))) {
            return invalid("invalid_role", "Token role is not accepted");
        }

        return OAuth2TokenValidatorResult.success();
    }

    private NimbusJwtDecoder createJwtDecoder(SupabaseJwtProperties properties) {
        if (properties.hasJwtSecret()) {
            SecretKeySpec secretKey = new SecretKeySpec(
                    properties.jwtSecret().getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            return NimbusJwtDecoder
                    .withSecretKey(secretKey)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
        }

        return NimbusJwtDecoder
                .withJwkSetUri(properties.jwksUri())
                .jwsAlgorithms(algorithms -> {
                    algorithms.add(SignatureAlgorithm.RS256);
                    algorithms.add(SignatureAlgorithm.ES256);
                })
                .build();
    }

    private OAuth2TokenValidatorResult invalid(String code, String description) {
        return OAuth2TokenValidatorResult.failure(new OAuth2Error(code, description, null));
    }

    private void writeErrorResponse(
            jakarta.servlet.http.HttpServletResponse response,
            ObjectMapper objectMapper,
            HttpStatus status,
            String message
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(new ApiResponse<>(message, null)));
    }
}
