package com.coreflow.common.util;

import java.time.Instant;

public final class TimeUtils {

    private TimeUtils() {
    }

    public static Instant nowUtc() {
        return Instant.now();
    }
}
