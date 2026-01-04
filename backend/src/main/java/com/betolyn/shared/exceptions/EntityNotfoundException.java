package com.betolyn.shared.exceptions;

import org.springframework.http.HttpStatus;

public class EntityNotfoundException extends BaseException {
    public EntityNotfoundException() {
        super("ENTITY_NOT_FOUND", "Entity not found", HttpStatus.NOT_FOUND);
    }

    public EntityNotfoundException(String code, String message) {
        super(code,message, HttpStatus.NOT_FOUND);
    }
}
