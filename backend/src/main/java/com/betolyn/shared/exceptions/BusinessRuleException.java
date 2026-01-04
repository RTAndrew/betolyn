package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends BaseException{
    public BusinessRuleException(String code, String message) {
        super(code, message, HttpStatus.NOT_ACCEPTABLE);
    }
}