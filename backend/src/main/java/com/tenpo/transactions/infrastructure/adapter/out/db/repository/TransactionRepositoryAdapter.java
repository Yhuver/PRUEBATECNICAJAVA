package com.tenpo.transactions.infrastructure.adapter.out.db.repository;

import com.tenpo.transactions.application.port.out.TransactionRepositoryPort;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.TransactionEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.jpa.TransactionJpaRepository;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.AccountMapper;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.TransactionMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final TransactionMapper transactionMapper;
    private final AccountMapper accountMapper;
    private final TransactionJpaRepository transactionRepositoryJpa;

    public TransactionRepositoryAdapter(
            TransactionMapper transactionMapper,
            AccountMapper accountMapper,
            TransactionJpaRepository transactionRepositoryJpa
    ) {
        this.transactionMapper = transactionMapper;
        this.accountMapper = accountMapper;
        this.transactionRepositoryJpa = transactionRepositoryJpa;
    }


    @Override
    public Optional<Transaction> findById(int id) {
        return transactionRepositoryJpa.findById(id).map(transactionMapper::toDomain);
    }

    @Override
    public Optional<Transaction> findByIdAndAccount(int id, Account account) {
        AccountEntity accountEntity = accountMapper.toEntity(account);
        return transactionRepositoryJpa
                .findByIdAndAccountAndActiveTrue(id, accountEntity)
                .map(transactionMapper::toDomain);
    }

    @Override
    public List<Transaction> findAllByAccount(Account account) {
        AccountEntity accountEntity = accountMapper.toEntity(account);
        return transactionRepositoryJpa.findAllByAccountAndActiveTrue(accountEntity)
                .stream()
                .map(transactionMapper::toDomain)
                .toList();
    }

    @Override
    public Transaction save(Transaction transaction) {
        TransactionEntity entity = transactionMapper.toEntity(transaction);
        TransactionEntity saved = transactionRepositoryJpa.save(entity);
        return transactionMapper.toDomain(saved);
    }

}