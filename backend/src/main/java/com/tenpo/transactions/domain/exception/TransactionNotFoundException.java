package com.tenpo.transactions.domain.exception;

public class TransactionNotFoundException extends RuntimeException {
    private static final String ERROR_CODE = "TRANSACTION_NOT_FOUND";

    public TransactionNotFoundException(int id) {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}