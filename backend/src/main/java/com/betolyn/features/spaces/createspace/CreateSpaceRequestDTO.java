package com.betolyn.features.spaces.createspace;

import org.jspecify.annotations.Nullable;

import java.util.List;

public record CreateSpaceRequestDTO(String name, @Nullable String description, @Nullable List<String> userIds) {
}
