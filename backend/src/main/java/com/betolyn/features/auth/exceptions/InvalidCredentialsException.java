package com.betolyn.features.auth.exceptions;

import com.betolyn.shared.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends BaseException {
    public InvalidCredentialsException() {
        super("INVALID_CREDENTIALS", "The credentials are invalid", HttpStatus.BAD_REQUEST);
    }
}
