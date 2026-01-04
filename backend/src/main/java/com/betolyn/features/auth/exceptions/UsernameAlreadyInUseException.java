package com.betolyn.features.auth.exceptions;

import com.betolyn.shared.exceptions.BadRequestException;

public class UsernameAlreadyInUseException extends BadRequestException {
    public UsernameAlreadyInUseException() {
        super("USERNAME_ALREADY_IN_USE", "The username is already in use. Please opt for another one");
    }
}
