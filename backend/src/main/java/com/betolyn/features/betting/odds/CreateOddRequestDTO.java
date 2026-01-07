package com.betolyn.features.betting.odds;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateOddRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private double value = 0.1;

    @NotNull
    private double minimumAmount;

    @NotNull
    private double maximumAmount;

    @NotNull
    private String criterionId;
}
