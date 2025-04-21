package com.tenpo.transactions.application.port.out;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface TransactionRepositoryPort  {
    Optional<Transaction> findById(int id);
    Optional<Transaction> findByIdAndAccount(int id, Account account);
    List<Transaction> findAllByAccount(Account account);
    Transaction save(Transaction transaction);
}
