package com.betolyn.features.betting.odds.updateoddvalue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateOddValueRequestDTO {
    @NotNull
    private BigDecimal value;
}
