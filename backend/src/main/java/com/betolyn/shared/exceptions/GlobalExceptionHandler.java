package com.betolyn.shared.exceptions;

import com.betolyn.utils.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    @RequestMapping()
    public ResponseEntity<ApiResponse<Void>> handleInternalExceptions(BaseException exception) {
        var code = exception.getCode();
        var status = exception.getStatus().value();
        var message = exception.getMessage();
        return ResponseEntity
                .status(status)
                .body(ApiResponse.error(message, status, code));
    }
}
