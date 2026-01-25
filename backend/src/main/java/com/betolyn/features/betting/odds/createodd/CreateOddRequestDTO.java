package com.betolyn.features.betting.odds.createodd;

import com.betolyn.features.betting.odds.OddStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.Optional;

@Data
public class CreateOddRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private double value = 0.1;

    @NotNull
    private String criterionId;

    private OddStatusEnum status;
}
