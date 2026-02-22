package com.betolyn.utils.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import java.time.LocalDateTime;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

record ApiError(String message, String code, List<Object> details) {}

public record ApiResponse<T>(
        String message,
        String code,
        int status,

        @JsonInclude(NON_NULL)
        @Nullable
        T data,

        LocalDateTime timestamp,

        @JsonInclude(NON_NULL)
        @Nullable
        Object error
) {
    public static <T> ApiResponse<T> success(@NonNull String message, T data) {
        return new ApiResponse<>(message, null,200, data, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> success(@NonNull String message) {
        return new ApiResponse<>(message, null,200, null, LocalDateTime.now(), null);
    }

    public static <T> ApiResponse<T> error(String message, String code, int status, List<Object> details) {
        return new ApiResponse<>(message, code, status, null, LocalDateTime.now(), new ApiError(message, code, details));
    }
}
