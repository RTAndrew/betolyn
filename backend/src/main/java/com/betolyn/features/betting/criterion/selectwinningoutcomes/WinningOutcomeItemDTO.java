package com.betolyn.features.betting.criterion.selectwinningoutcomes;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WinningOutcomeItemDTO {
    @NotNull
    private String id;

    private Boolean isWinner = false;
}
