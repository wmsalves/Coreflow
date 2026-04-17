package com.coreflow.config;

import java.util.List;

public final class RequiredEnvironmentValidator {

    private static final List<String> REQUIRED_ASCEND_VARIABLES = List.of(
            "ASCEND_API_KEY",
            "ASCEND_API_HOST",
            "ASCEND_API_BASE_URL"
    );

    private RequiredEnvironmentValidator() {
    }

    public static void validateAscendConfig() {
        for (String variableName : REQUIRED_ASCEND_VARIABLES) {
            if (!hasValue(variableName)) {
                throw new IllegalStateException("Missing " + variableName + " environment variable");
            }
        }
    }

    private static boolean hasValue(String variableName) {
        String environmentValue = System.getenv(variableName);
        if (environmentValue != null && !environmentValue.isBlank()) {
            return true;
        }

        String propertyValue = System.getProperty(variableName);
        return propertyValue != null && !propertyValue.isBlank();
    }
}
