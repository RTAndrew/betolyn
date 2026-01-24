package com.betolyn.features.betting.odds;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class OddCannotPublishException extends BusinessRuleException {
    public OddCannotPublishException() {
        super("ODD_CANNOT_PUBLISH", "Odd can only be published when criterion status is SUSPENDED or DRAFT");
    }
}
