package com.tenpo.transactions.application.port.out;

import com.tenpo.transactions.domain.model.Account;

public interface AccountRepositoryPort {
    boolean existsByEmail(String email);
    Account findByEmail(String email);
    Account save(Account account);
}
