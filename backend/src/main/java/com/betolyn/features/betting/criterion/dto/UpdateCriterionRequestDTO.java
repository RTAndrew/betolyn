package com.betolyn.features.betting.criterion.dto;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;
import lombok.Data;
import lombok.NonNull;


@Data
public class UpdateCriterionRequestDTO {

    @NonNull // it's the only field being updated
    private CriterionStatusEnum status;
}
