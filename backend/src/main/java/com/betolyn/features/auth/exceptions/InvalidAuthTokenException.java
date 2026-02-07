package com.betolyn.features.auth.exceptions;

import com.betolyn.shared.exceptions.BaseException;
import org.springframework.http.HttpStatus;

public class InvalidAuthTokenException extends BaseException {
    public InvalidAuthTokenException() {
        super("INVALID_AUTH_TOKEN",
                "The authentication token is invalid. " +
                "Remove the token on subsequent request, otherwise the server will continue to recuse"
                ,HttpStatus.BAD_REQUEST
        );
    }
}
