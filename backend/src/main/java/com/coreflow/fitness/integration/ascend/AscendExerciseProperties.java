package com.coreflow.fitness.integration.ascend;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "coreflow.fitness.ascend")
public class AscendExerciseProperties {

    private String baseUrl;
    private String host;
    private String key;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isConfigured() {
        return hasText(baseUrl) && hasText(host) && hasText(key);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
