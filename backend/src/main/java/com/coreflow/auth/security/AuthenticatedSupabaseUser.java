package com.coreflow.auth.security;

import java.util.UUID;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

public record AuthenticatedSupabaseUser(UUID id) implements AuthenticatedPrincipal {

    public static AuthenticatedSupabaseUser fromJwt(Jwt jwt) {
        return new AuthenticatedSupabaseUser(UUID.fromString(jwt.getSubject()));
    }

    @Override
    public String getName() {
        return userId();
    }

    public String userId() {
        return id.toString();
    }
}
