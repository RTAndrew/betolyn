package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException{
    public BadRequestException(String code, String message) {
        super(code, message, HttpStatus.BAD_REQUEST);
    }
}