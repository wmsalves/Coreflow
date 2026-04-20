package com.coreflow.common.validation;

import com.coreflow.common.exception.ApiException;
import java.util.List;
import java.util.UUID;

public final class ApiRequestValidator {

    private ApiRequestValidator() {
    }

    public static Long requirePositiveLong(Long value, String fieldName) {
        if (value == null || value <= 0) {
            throw new ApiException(fieldName + " must be a positive number");
        }

        return value;
    }

    public static String requireUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ApiException("User id is required");
        }

        try {
            UUID.fromString(userId);
        } catch (IllegalArgumentException exception) {
            throw new ApiException("User id must be a valid UUID");
        }

        return userId;
    }

    public static String requireText(String value, String fieldName, int maxLength) {
        String normalizedValue = optionalText(value, fieldName, maxLength);

        if (normalizedValue == null) {
            throw new ApiException(fieldName + " is required");
        }

        return normalizedValue;
    }

    public static String optionalText(String value, String fieldName, int maxLength) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        if (normalizedValue.isEmpty()) {
            return null;
        }

        if (normalizedValue.length() > maxLength) {
            throw new ApiException(fieldName + " must be " + maxLength + " characters or fewer");
        }

        if (hasUnsupportedControlCharacter(normalizedValue)) {
            throw new ApiException(fieldName + " contains unsupported control characters");
        }

        return normalizedValue;
    }

    public static Integer optionalIntegerRange(
            Integer value,
            String fieldName,
            int minimum,
            int maximum
    ) {
        if (value == null) {
            return null;
        }

        if (value < minimum || value > maximum) {
            throw new ApiException(fieldName + " must be between " + minimum + " and " + maximum);
        }

        return value;
    }

    public static Double optionalDoubleRange(
            Double value,
            String fieldName,
            double minimum,
            double maximum
    ) {
        if (value == null) {
            return null;
        }

        if (value < minimum || value > maximum) {
            throw new ApiException(fieldName + " must be between " + minimum + " and " + maximum);
        }

        return value;
    }

    public static <T> List<T> requireList(String fieldName, List<T> values, int maxSize) {
        if (values == null || values.isEmpty()) {
            throw new ApiException(fieldName + " is required");
        }

        if (values.size() > maxSize) {
            throw new ApiException(fieldName + " must contain " + maxSize + " items or fewer");
        }

        return values;
    }

    private static boolean hasUnsupportedControlCharacter(String value) {
        for (int index = 0; index < value.length(); index++) {
            char character = value.charAt(index);
            if (Character.isISOControl(character)
                    && character != '\n'
                    && character != '\r'
                    && character != '\t') {
                return true;
            }
        }

        return false;
    }
}
