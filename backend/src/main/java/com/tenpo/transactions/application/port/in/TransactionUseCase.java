package com.tenpo.transactions.application.port.in;

import com.tenpo.transactions.domain.model.Transaction;
import java.util.List;
import java.util.Optional;

public interface TransactionUseCase {
    List<Transaction> findAll();
    Optional<Transaction> getById(int id);
    Transaction save(Transaction transaction);
    Transaction update(int id, Transaction transaction);
    boolean delete(int id);
}
