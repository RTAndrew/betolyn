package com.betolyn.features.betting.criterion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;


@Data
public class CreateCriterionRequestDTO {
    @NotNull
    private String name;
    @NotNull
    private String matchId;
    @NotNull
    private boolean allowMultipleOdds = true;

    private List<CreateCriterionOddRequestDTO> odds = List.of();
}
