package com.tenpo.transactions.domain.exception;

public class InvalidTransactionAmountException extends RuntimeException {
    private static final String ERROR_CODE = "INVALID_TRANSACTION_AMOUNT";

    public InvalidTransactionAmountException() {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
