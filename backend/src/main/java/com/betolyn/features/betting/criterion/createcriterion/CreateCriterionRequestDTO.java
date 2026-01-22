package com.betolyn.features.betting.criterion.createcriterion;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import com.betolyn.features.betting.criterion.dto.CreateCriterionOddRequestDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.jetbrains.annotations.Nullable;

import java.util.List;

@Data
public class CreateCriterionRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private String matchId;

    @NotNull
    private boolean allowMultipleOdds = true;

    @Nullable
    private CriterionStatusEnum status;

    private List<CreateCriterionOddRequestDTO> odds = List.of();
}
