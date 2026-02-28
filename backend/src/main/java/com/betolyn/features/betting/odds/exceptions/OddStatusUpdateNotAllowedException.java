package com.betolyn.features.betting.odds.exceptions;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class OddStatusUpdateNotAllowedException extends BusinessRuleException {
    public OddStatusUpdateNotAllowedException() {
        super("ODD_STATUS_UPDATE_NOT_ALLOWED", "Odd status can only be set to ACTIVE or SUSPENDED");
    }
}
