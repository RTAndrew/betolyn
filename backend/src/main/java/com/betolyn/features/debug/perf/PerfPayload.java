package com.betolyn.features.debug.perf;

public record PerfPayload<T>(T result, PerfMeta perf) {
}
