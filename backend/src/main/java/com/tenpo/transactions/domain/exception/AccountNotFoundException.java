package com.tenpo.transactions.domain.exception;

public class AccountNotFoundException extends RuntimeException {
    private static final String ERROR_CODE = "ACCOUNT_NOT_FOUND";

    public AccountNotFoundException(String username) {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
