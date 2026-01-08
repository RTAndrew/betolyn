package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class InternalServerException extends BaseException {
    public InternalServerException() {
        super("INTERNAL_ERROR", "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    public InternalServerException(String message) {
        super("INTERNAL_ERROR", message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
