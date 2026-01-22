package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCriterionStatusRequestDTO {
    @NotNull
    private CriterionStatusEnum status;
}
