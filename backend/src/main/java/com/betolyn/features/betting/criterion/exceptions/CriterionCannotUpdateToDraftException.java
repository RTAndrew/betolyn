package com.betolyn.features.betting.criterion.exceptions;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class CriterionCannotUpdateToDraftException extends BusinessRuleException {
    public CriterionCannotUpdateToDraftException() {
        super("CRITERION_CANNOT_UPDATE_TO_DRAFT", "Criteria cannot be updated/reverted to draft");
    }
}
