package com.tenpo.transactions.domain.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AccountNotFoundException extends ResponseStatusException {
    public AccountNotFoundException(String username) {
        super(HttpStatus.NOT_FOUND, "Account not found for user: " + username);
    }
}
