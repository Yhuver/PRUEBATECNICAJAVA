package com.tenpo.transactions.domain.exception;

public class ExpiredAccessTokenException extends RuntimeException {
    private static final String ERROR_CODE = "EXPIRED_ACCESS_TOKEN";

    public ExpiredAccessTokenException() {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
