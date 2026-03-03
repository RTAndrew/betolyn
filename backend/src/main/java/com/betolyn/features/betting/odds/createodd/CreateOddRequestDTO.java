package com.betolyn.features.betting.odds.createodd;

import com.betolyn.features.betting.odds.OddStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateOddRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private BigDecimal value;

    @NotNull
    private String criterionId;

    private OddStatusEnum status;
}
