package com.tenpo.transactions.application.port.out;

import com.tenpo.transactions.domain.model.Account;

public interface AccountRepositoryPort {
    boolean existsByUsername(String username);
    Account findByUsername(String username);
    Account save(Account account);
}
