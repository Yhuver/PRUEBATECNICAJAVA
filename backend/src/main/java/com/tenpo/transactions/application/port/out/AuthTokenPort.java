package com.tenpo.transactions.application.port.out;

import com.tenpo.transactions.domain.model.Account;

public interface AuthTokenPort {
    String generateToken(Account account);
    String generateRefreshToken(Account account);
    boolean isTokenValid(String token);
    String extractUsername(String token);
}