package com.betolyn.features.betting.betslips.voiding.voidcriterion;

import com.betolyn.features.betting.criterion.CriterionEntity;

import jakarta.annotation.Nullable;

public record VoidCriterionParam(String criterionId, @Nullable CriterionEntity criterion, String reason,
    Boolean isMatchVoid) {
}
