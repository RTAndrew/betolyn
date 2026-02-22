package com.betolyn.features.betting.betslips;

import com.betolyn.features.betting.betslips.placebet.RejectedBetsException;

import java.util.List;

public class DuplicateOddsInBetSlipException extends RejectedBetsException {
    public DuplicateOddsInBetSlipException(List<Object> rejectedOdds) {
        super("DUPLICATE_ODDS_IN_BET_SLIP", "There should be no duplicate odds in the same bet slip", rejectedOdds);
    }
}
