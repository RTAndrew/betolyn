package com.betolyn.features.betting.odds.exceptions;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class OddCannotBeActiveWhenCriterionNotActiveException extends BusinessRuleException {
    public OddCannotBeActiveWhenCriterionNotActiveException() {
        super("ODD_CANNOT_BE_ACTIVE_WHEN_CRITERION_NOT_ACTIVE", "Odd status cannot be changed to ACTIVE when its criterion is not ACTIVE");
    }
}
