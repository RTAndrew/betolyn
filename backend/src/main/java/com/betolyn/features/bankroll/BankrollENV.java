package com.betolyn.features.bankroll;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@ConfigurationProperties(prefix = "app.bankroll")
@ConfigurationPropertiesScan
public record BankrollENV(
        float initialSignUpCredit
) {
}