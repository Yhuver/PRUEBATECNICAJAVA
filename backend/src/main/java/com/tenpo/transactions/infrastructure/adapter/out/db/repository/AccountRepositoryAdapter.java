package com.tenpo.transactions.infrastructure.adapter.out.db.repository;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.jpa.AccountJpaRepository;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.AccountMapper;
import org.springframework.stereotype.Repository;

@Repository
public class AccountRepositoryAdapter implements AccountRepositoryPort {

    private final AccountMapper mapper;
    private final AccountJpaRepository jpa;

    public AccountRepositoryAdapter(AccountMapper mapper, AccountJpaRepository jpa) {
        this.mapper = mapper;
        this.jpa = jpa;
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpa.existsByEmail(email);
    }

    @Override
    public Account findByEmail(String email) {
        AccountEntity user = jpa.findByEmail(email);
        return mapper.toDomain(user);
    }

    @Override
    public Account save(Account account) {AccountEntity accountEntity = mapper.toEntity(account);
        AccountEntity saved = jpa.save(accountEntity);
        return mapper.toDomain(saved);
    }
}
