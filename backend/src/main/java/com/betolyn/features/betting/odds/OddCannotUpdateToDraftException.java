package com.betolyn.features.betting.odds;

import com.betolyn.shared.exceptions.BusinessRuleException;

public class OddCannotUpdateToDraftException extends BusinessRuleException {
    public OddCannotUpdateToDraftException() {
        super("ODD_CANNOT_UPDATE_TO_DRAFT", "Odd cannot be updated/reverted to draft");
    }
}
