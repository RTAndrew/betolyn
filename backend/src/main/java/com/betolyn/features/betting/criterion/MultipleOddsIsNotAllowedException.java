package com.betolyn.features.betting.criterion;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class MultipleOddsIsNotAllowedException extends BusinessRuleException {
    public MultipleOddsIsNotAllowedException() {
        super("MULTIPLE_ODDS_NOT_ALLOWED", "The criterion does not accept multiple odds");
    }
}
