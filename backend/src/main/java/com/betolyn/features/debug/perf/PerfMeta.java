package com.betolyn.features.debug.perf;

public record PerfMeta(
        long totalMs,
        Long queryMs,
        Long mapMs,
        Integer recordCount
) {
    public static PerfMeta of(long totalMs) {
        return new PerfMeta(totalMs, null, null, null);
    }

    public static PerfMeta withPhases(long totalMs, long queryMs, Long mapMs, int recordCount) {
        return new PerfMeta(totalMs, queryMs, mapMs, recordCount);
    }
}
