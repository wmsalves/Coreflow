package com.coreflow.auth.security;

import java.net.URI;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "coreflow.auth.supabase")
public class SupabaseJwtProperties {

    private String url;
    private String jwksUri;
    private String jwtSecret;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getJwksUri() {
        return jwksUri;
    }

    public void setJwksUri(String jwksUri) {
        this.jwksUri = jwksUri;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public String issuer() {
        return normalizedBaseUrl() + "/auth/v1";
    }

    public String jwksUri() {
        if (jwksUri != null && !jwksUri.isBlank()) {
            return normalizeHttpsUrl(jwksUri.trim(), "SUPABASE_JWKS_URI");
        }

        return issuer() + "/.well-known/jwks.json";
    }

    public boolean hasJwtSecret() {
        return jwtSecret != null && !jwtSecret.isBlank();
    }

    public String jwtSecret() {
        if (!hasJwtSecret()) {
            throw new IllegalStateException("Missing SUPABASE_JWT_SECRET environment variable");
        }

        return jwtSecret.trim();
    }

    private String normalizedBaseUrl() {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("Missing SUPABASE_URL environment variable");
        }

        return normalizeHttpsUrl(url.trim(), "SUPABASE_URL").replaceAll("/+$", "");
    }

    private String normalizeHttpsUrl(String value, String variableName) {
        URI uri = URI.create(value);
        String scheme = uri.getScheme();
        String host = uri.getHost();

        if (!"https".equalsIgnoreCase(scheme) || host == null || host.isBlank()) {
            throw new IllegalStateException(variableName + " must be an HTTPS Supabase URL");
        }

        return uri.toString();
    }
}
