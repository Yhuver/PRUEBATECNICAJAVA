package com.tenpo.transactions.domain.exception;

public class TransactionValidationException extends RuntimeException {
    private static final String ERROR_CODE = "TRANSACTION_VALIDATION_FAILED";

    public TransactionValidationException() {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
