package com.betolyn.features.betting.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCriterionRequestDTO {
    @NotNull
    private String name;
    private String matchId;
    @NotNull
    private boolean allowMultipleOdds = true;
}
