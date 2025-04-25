package com.tenpo.transactions.application.port.out;

import com.tenpo.transactions.domain.model.Account;

public interface AuthTokenPort {
    String generateAccessToken(Account account);
    String generateRefreshToken(Account account);
    boolean isValid(String token);
    String extractUsername(String token);
}