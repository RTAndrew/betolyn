package com.betolyn.features.matches;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class CriterionDoesNotBelongToMatchException extends BusinessRuleException {
    public CriterionDoesNotBelongToMatchException() {
        super("CRITERION_DOES_NOT_BELONG_TO_MATCH", "Criterion does not belong to the match");
    }
}
