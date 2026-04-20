package com.coreflow.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public final class DotenvEnvironmentLoader {

    private DotenvEnvironmentLoader() {
    }

    public static void load() {
        loadFromDirectories(List.of("backend", "."));
        loadSupabaseUrlFromFrontendEnv();
    }

    private static void loadFromDirectories(List<String> directories) {
        for (String directory : directories) {
            if (!Files.isDirectory(Path.of(directory))) {
                continue;
            }

            Dotenv dotenv = Dotenv.configure()
                    .directory(directory)
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            for (DotenvEntry entry : dotenv.entries()) {
                setIfMissing(entry.getKey(), entry.getValue());
            }
        }
    }

    private static void setIfMissing(String key, String value) {
        if (System.getenv(key) != null || System.getProperty(key) != null) {
            return;
        }
        System.setProperty(key, value);
    }

    private static void loadSupabaseUrlFromFrontendEnv() {
        if (hasValue("SUPABASE_URL")) {
            return;
        }

        for (String directory : List.of("frontend", "../frontend")) {
            if (!Files.isDirectory(Path.of(directory))) {
                continue;
            }

            Dotenv dotenv = Dotenv.configure()
                    .directory(directory)
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();
            String frontendSupabaseUrl = dotenv.get("NEXT_PUBLIC_SUPABASE_URL");
            if (frontendSupabaseUrl != null && !frontendSupabaseUrl.isBlank()) {
                System.setProperty("SUPABASE_URL", frontendSupabaseUrl.trim());
                return;
            }
        }
    }

    private static boolean hasValue(String key) {
        String environmentValue = System.getenv(key);
        if (environmentValue != null && !environmentValue.isBlank()) {
            return true;
        }

        String propertyValue = System.getProperty(key);
        return propertyValue != null && !propertyValue.isBlank();
    }
}
