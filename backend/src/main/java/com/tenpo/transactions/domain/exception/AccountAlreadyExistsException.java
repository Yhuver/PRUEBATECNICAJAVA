package com.tenpo.transactions.domain.exception;

public class AccountAlreadyExistsException extends RuntimeException {
    private static final String ERROR_CODE = "ACCOUNT_ALREADY_EXISTS";

    public AccountAlreadyExistsException() {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
