package com.tenpo.transactions.domain.exception.transaction;

public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException(int id) {
        super("Transaction with id " + id + " not found");
    }
}