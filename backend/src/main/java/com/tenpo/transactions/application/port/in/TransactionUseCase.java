package com.tenpo.transactions.application.port.in;

import com.tenpo.transactions.domain.model.Transaction;
import java.util.List;

public interface TransactionUseCase {
    List<Transaction> findAll();
    Transaction save(Transaction transaction);
    Transaction update(int id, Transaction transaction);
    boolean delete(int id);
}
