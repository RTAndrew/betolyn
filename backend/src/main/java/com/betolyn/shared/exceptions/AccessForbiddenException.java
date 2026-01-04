package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class AccessForbiddenException extends BaseException{
    public AccessForbiddenException() {
        super("RESOURCE_FORBIDDEN", "You do not have enough permission to access this resource.", HttpStatus.FORBIDDEN);
    }

    public AccessForbiddenException(String code, String message) {
        super(code, message, HttpStatus.FORBIDDEN);
    }
}
