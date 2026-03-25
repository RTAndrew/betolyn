package com.betolyn.features.spaces.exceptions;

import com.betolyn.shared.exceptions.EntityNotfoundException;

public class SpaceNotFoundException extends EntityNotfoundException {
    public SpaceNotFoundException() {
        super("SPACE_NOT_FOUND", "Space not found");
    }
}
