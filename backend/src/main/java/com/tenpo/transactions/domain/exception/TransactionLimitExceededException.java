package com.tenpo.transactions.domain.exception;

public class TransactionLimitExceededException extends RuntimeException {
    private static final String ERROR_CODE = "TRANSACTION_LIMIT_EXCEEDED";

    public TransactionLimitExceededException() {
        super(ERROR_CODE);
    }

    public String getErrorCode() {
        return ERROR_CODE;
    }
}
