package com.tenpo.transactions.application.port.in;

import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;

public interface AuthUseCase {
    AuthResult authenticate(String username, String password);
    AuthResult register(Account account);
    AuthResult refreshToken(String refresh);
}
