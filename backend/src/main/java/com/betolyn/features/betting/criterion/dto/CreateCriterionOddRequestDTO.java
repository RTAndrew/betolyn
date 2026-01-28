package com.betolyn.features.betting.criterion.dto;

import com.betolyn.features.betting.odds.OddStatusEnum;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCriterionOddRequestDTO {
    private String name;

    @NotNull
    private double value;

    private OddStatusEnum status;
}
