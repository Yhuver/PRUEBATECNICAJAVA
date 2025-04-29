package com.tenpo.transactions.infrastructure.adapter.in.web.exception;

import com.tenpo.transactions.domain.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<Object> handleTransactionNotFoundException(
            TransactionNotFoundException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TransactionValidationException.class)
    public ResponseEntity<Object> handleTransactionValidationException(
            TransactionValidationException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<Object> handleAccountNotFoundException(
            AccountNotFoundException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TransactionLimitExceededException.class)
    public ResponseEntity<Object> handleTransactionLimitExceededException(
            TransactionLimitExceededException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidTransactionAmountException.class)
    public ResponseEntity<Object> handleInvalidTransactionException(
            InvalidTransactionAmountException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountAlreadyExistsException.class)
    public ResponseEntity<Object> handleAccountAlreadyExistsException(
            AccountAlreadyExistsException ex, WebRequest request) {
        return buildErrorResponse(ex.getErrorCode(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ExpiredAccessTokenException.class)
    public ResponseEntity<String> handleExpiredAccessToken(
            ExpiredAccessTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Token de acceso expirado");
    }

    @ExceptionHandler(InvalidAccessTokenException.class)
    public ResponseEntity<String> handleInvalidAccessToken(
            InvalidAccessTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Token de acceso no válido");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now().toString())
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("VALIDATION_FAILED")
                .errors(errors)
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(
            Exception ex, WebRequest request) {
        return buildErrorResponse("INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Object> buildErrorResponse(String errorCode, HttpStatus status) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(Instant.now().toString())
                .status(status.value())
                .errorCode(errorCode)
                .build();

        return new ResponseEntity<>(errorResponse, status);
    }
}
