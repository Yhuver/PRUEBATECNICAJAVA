package com.tenpo.transactions.domain.exception;

public class InvalidAccessTokenException extends RuntimeException {
    private static final String ERROR_CODE = "INVALID_ACCESS_TOKEN";

    public InvalidAccessTokenException() {
        super(ERROR_CODE);
    }

    public InvalidAccessTokenException(String message, Throwable cause) {
        super(ERROR_CODE, cause);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}