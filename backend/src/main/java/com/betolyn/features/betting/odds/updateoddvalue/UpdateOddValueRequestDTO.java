package com.betolyn.features.betting.odds.updateoddvalue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOddValueRequestDTO {
    @NotNull
    private Double value;
}
