package com.tenpo.transactions.domain.exception.transaction;

public class TransactionValidationException extends RuntimeException {
    public TransactionValidationException(String message) {
        super(message);
    }
}
