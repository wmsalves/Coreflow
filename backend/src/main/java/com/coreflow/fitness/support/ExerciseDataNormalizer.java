package com.coreflow.fitness.support;

import java.text.Normalizer;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public final class ExerciseDataNormalizer {

    private static final Set<String> EMPTY_TEXT_VALUES = Set.of(
            "null",
            "nao informado",
            "não informado",
            "not informed",
            "not specified",
            "undefined",
            "n/a",
            "none",
            "-"
    );

    private ExerciseDataNormalizer() {
    }

    public static String cleanText(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.replace('\u00A0', ' ').trim().replaceAll("\\s+", " ");
        if (normalized.isBlank() || EMPTY_TEXT_VALUES.contains(normalizeKey(normalized))) {
            return null;
        }

        return normalized;
    }

    public static String cleanName(String value) {
        return toTitleCase(cleanText(value));
    }

    public static String cleanLabel(String value) {
        String cleaned = cleanText(value);
        if (cleaned == null) {
            return null;
        }

        return toTitleCase(cleaned.replace('_', ' ').replace('-', ' '));
    }

    public static String cleanUrl(String value) {
        String cleaned = cleanText(value);
        if (cleaned == null) {
            return null;
        }

        return cleaned.startsWith("http://") || cleaned.startsWith("https://") ? cleaned : null;
    }

    public static List<String> cleanInstructions(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }

        Set<String> cleanedValues = new LinkedHashSet<>();
        for (String value : values) {
            String cleaned = cleanText(value);
            if (cleaned != null) {
                cleanedValues.add(cleaned);
            }
        }

        return List.copyOf(cleanedValues);
    }

    public static ResolvedMedia resolveMedia(String gifUrl, String imageUrl, String videoUrl) {
        String cleanedGifUrl = cleanUrl(gifUrl);
        String cleanedImageUrl = cleanUrl(imageUrl);
        String cleanedVideoUrl = cleanUrl(videoUrl);

        if (cleanedVideoUrl != null && cleanedGifUrl != null) {
            return new ResolvedMedia("video", cleanedVideoUrl);
        }
        if (cleanedGifUrl != null) {
            return new ResolvedMedia("gif", cleanedGifUrl);
        }
        if (cleanedVideoUrl != null) {
            return new ResolvedMedia("video", cleanedVideoUrl);
        }
        if (cleanedImageUrl != null) {
            return new ResolvedMedia("image", cleanedImageUrl);
        }

        return null;
    }

    public static String resolveMediaUrl(String gifUrl, String imageUrl, String videoUrl) {
        ResolvedMedia resolvedMedia = resolveMedia(gifUrl, imageUrl, videoUrl);
        return resolvedMedia == null ? null : resolvedMedia.url();
    }

    public static String normalizeKey(String value) {
        if (value == null) {
            return "";
        }

        String stripped = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return stripped.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
    }

    private static String toTitleCase(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.toLowerCase(Locale.ROOT);
        StringBuilder builder = new StringBuilder(normalized.length());
        boolean capitalizeNext = true;
        for (int index = 0; index < normalized.length(); index++) {
            char current = normalized.charAt(index);
            if (Character.isLetter(current)) {
                builder.append(capitalizeNext ? Character.toTitleCase(current) : current);
                capitalizeNext = false;
            } else {
                builder.append(current);
                capitalizeNext = Character.isWhitespace(current) || current == '/' || current == '(';
            }
        }

        return builder.toString();
    }

    public record ResolvedMedia(String type, String url) {
    }
}
