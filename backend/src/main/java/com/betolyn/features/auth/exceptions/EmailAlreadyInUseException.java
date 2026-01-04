package com.betolyn.features.auth.exceptions;

import com.betolyn.shared.exceptions.BadRequestException;

public class EmailAlreadyInUseException extends BadRequestException {
    public EmailAlreadyInUseException() {
        super("EMAIL_ALREADY_IN_USE", "The email is already in use. Please opt for another one");

    }
}
