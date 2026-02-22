package com.betolyn.shared.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
public abstract class BaseException extends RuntimeException{
    private final String code;
    private final HttpStatus status;
    private final List<Object> details;

    protected BaseException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = List.of();
    }

    protected BaseException(String code, String message, HttpStatus status, List<Object> details) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

