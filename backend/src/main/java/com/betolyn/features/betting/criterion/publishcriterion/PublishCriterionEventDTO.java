package com.betolyn.features.betting.criterion.publishcriterion;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;

public record PublishCriterionEventDTO(String criterionId, CriterionStatusEnum status) {
}
