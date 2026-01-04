package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends BaseException{
    public AuthenticationException(String code, String message) {
        super(code, message, HttpStatus.UNAUTHORIZED);
    }
}
