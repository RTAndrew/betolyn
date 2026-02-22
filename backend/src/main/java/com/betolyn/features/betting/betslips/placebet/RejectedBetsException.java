package com.betolyn.features.betting.betslips.placebet;

import com.betolyn.shared.exceptions.BusinessRuleException;

import java.util.List;

public class RejectedBetsException extends BusinessRuleException {
    public RejectedBetsException(String code, String message, List<Object> details) {
        super(code, message, details);
    }
}
