package com.betolyn.features.teams;

import com.betolyn.shared.exceptions.EntityNotfoundException;

public class TeamNotFoundException extends EntityNotfoundException {
    public TeamNotFoundException() {
        super("TEAM_NOT_FOUND", "Team not found");
    }
}
