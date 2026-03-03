package com.betolyn.features.betting.criterion.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateCriterionOddRequestDTO {
    private String name;

    @NotNull
    private BigDecimal value;

    private OddStatusEnum status;
}
