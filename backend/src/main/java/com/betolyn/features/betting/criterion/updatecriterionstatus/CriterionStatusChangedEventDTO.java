package com.betolyn.features.betting.criterion.updatecriterionstatus;

import com.betolyn.features.betting.criterion.CriterionStatusEnum;

public record CriterionStatusChangedEventDTO(String criterionId, CriterionStatusEnum status) {
}
