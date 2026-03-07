package com.betolyn.features.betting.criterion.setallowmultiplewinners;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetAllowMultipleWinnersRequestDTO {
    @NotNull
    private Boolean allowMultipleWinners;
}
