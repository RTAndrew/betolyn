package com.betolyn.shared.baseEntity;

import org.jspecify.annotations.Nullable;

public record EntityUUID(int size, @Nullable String prefix) {
}
