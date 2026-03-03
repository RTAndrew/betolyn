package com.betolyn.features.betting.betslips;

import java.math.BigDecimal;

import com.betolyn.shared.exceptions.BusinessRuleException;

public final class OddPrice {

    private final BigDecimal value;

    public OddPrice(BigDecimal value) {
        if (value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("ODD_PRICE_MUST_BE_GREATER_THAN_ZERO", "Odds must be > 0.00");
        }
        this.value = value;
    }

    public BigDecimal toBigDecimal() {
        return value;
    }
}


