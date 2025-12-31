package com.betolyn.features.auth.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@ConfigurationProperties(prefix = "app.auth")
@ConfigurationPropertiesScan
public record AuthConstants (
        @NotBlank
        String jwtSecret,
        @NotBlank
        int sessionExpirationInDays,
        @NotBlank
        String cookiesTokenNameKey
) { }
