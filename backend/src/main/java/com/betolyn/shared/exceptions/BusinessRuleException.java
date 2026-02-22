package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;

public class BusinessRuleException extends BaseException{
    public BusinessRuleException(String code, String message) {
        super(code, message, HttpStatus.NOT_ACCEPTABLE);
    }
    public BusinessRuleException(String code, String message, List<Object> details) {
        super(code, message, HttpStatus.NOT_ACCEPTABLE, details);
    }
}