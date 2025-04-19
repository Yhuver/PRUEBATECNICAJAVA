package com.tenpo.transactions.domain.port.input;

import com.tenpo.transactions.domain.model.Account;

import java.util.List;

public interface AccountUseCase {
    Account findById(int id);
    List<Account> findAll();
    Account save(Account account);
    Account update(Account account);
    boolean delete(int id);
}
