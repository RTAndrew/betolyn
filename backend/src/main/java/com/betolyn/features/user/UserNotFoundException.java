package com.betolyn.features.user;

import com.betolyn.shared.exceptions.EntityNotfoundException;

public class UserNotFoundException extends EntityNotfoundException {
    public UserNotFoundException() {
        super("USER_NOT_FOUND", "User not found");
    }
}
