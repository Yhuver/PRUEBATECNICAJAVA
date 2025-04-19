package com.tenpo.transactions.application.service;

import com.tenpo.transactions.domain.exception.transaction.TransactionNotFoundException;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.domain.port.input.TransactionUseCase;
import com.tenpo.transactions.domain.port.output.persistence.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class TransactionService implements TransactionUseCase {

    private final TransactionRepository repository;

    @Override
    public Transaction findById(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException(id));
    }

    @Override
    public List<Transaction> findAll() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {
        if (transaction.getCreatedAt() == null){
            transaction.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(transaction);
    }

    @Override
    public Transaction update(int id, Transaction transaction) {
        Transaction existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if(!(existing.isActive())){
            throw new RuntimeException("Transaction not found");
        }
        existing.setAmount(transaction.getAmount());
        existing.setMerchant(transaction.getMerchant());
        existing.setTenpistaName(transaction.getTenpistaName());
        existing.setUpdatedAt(LocalDateTime.now());

        return repository.save(existing);
    }

    @Override
    public boolean delete(int id) {
        Transaction transaction = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.isActive()) {
            throw new RuntimeException("Transaction already inactive");
        }

        transaction.setActive(false);
        repository.save(transaction);
        return true;
    }

}
