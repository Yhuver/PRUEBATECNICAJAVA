package com.tenpo.transactions.application.service;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.port.input.AccountUseCase;
import com.tenpo.transactions.domain.port.output.persistence.AccountRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


// TODO Implementar los metodos de cuenta

@Service
@AllArgsConstructor
public class AccountService implements AccountUseCase {

    private final AccountRepository repository;


    @Override
    public Account findById(int id) {
        return null;
    }

    @Override
    public List<Account> findAll() {
        return List.of();
    }

    @Override
    public Account save(Account account) {
        return null;
    }

    @Override
    public Account update(Account account) {
        return null;
    }

    @Override
    public boolean delete(int id) {
        return false;
    }
}
