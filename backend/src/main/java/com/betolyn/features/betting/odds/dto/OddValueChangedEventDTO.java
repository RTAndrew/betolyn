package com.betolyn.features.betting.odds.dto;

import java.math.BigDecimal;

public record OddValueChangedEventDTO(String oddId, OddValueChangeDirection direction, BigDecimal value) {
}
