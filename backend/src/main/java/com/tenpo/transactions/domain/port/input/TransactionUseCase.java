package com.tenpo.transactions.domain.port.input;

import com.tenpo.transactions.domain.model.Transaction;
import java.util.List;

public interface TransactionUseCase {
    Transaction findById(int id);
    List<Transaction> findAll();
    Transaction save(Transaction transaction);
    Transaction update(int id, Transaction transaction);
    boolean delete(int id);
}
