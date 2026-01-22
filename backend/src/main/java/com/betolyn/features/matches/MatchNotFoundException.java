package com.betolyn.features.matches;

import com.betolyn.shared.exceptions.EntityNotfoundException;

public class MatchNotFoundException extends EntityNotfoundException {
    public MatchNotFoundException() {
        super("MATCH_NOT_FOUND", "Match not found");
    }
}
