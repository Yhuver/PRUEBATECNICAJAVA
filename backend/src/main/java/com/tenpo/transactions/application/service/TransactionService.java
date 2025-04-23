package com.tenpo.transactions.application.service;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.TransactionRepositoryPort;
import com.tenpo.transactions.domain.exception.AccountNotFoundException;
import com.tenpo.transactions.domain.exception.TransactionNotFoundException;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService implements TransactionUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final AccountRepositoryPort accountRepositoryPort;

    public TransactionService (
            TransactionRepositoryPort transactionRepositoryPort,
            AccountRepositoryPort accountRepositoryPort
    ) {
        this.transactionRepositoryPort = transactionRepositoryPort;
        this.accountRepositoryPort = accountRepositoryPort;
    }

    @Override
    public List<Transaction> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepositoryPort.findByEmail(username);
        return transactionRepositoryPort.findAllByAccount(account);
    }

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepositoryPort.findByEmail(username);

        transaction.setActive(true);
        transaction.setAccount(account);

        if (transaction.getCreatedAt() == null){
            transaction.setCreatedAt(LocalDateTime.now());
        }

        return transactionRepositoryPort.save(transaction);
    }

    @Override
    public Transaction update(int id, Transaction transaction) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepositoryPort.findByEmail(username);

        if (account == null) {
            throw new AccountNotFoundException(username);
        }

        Transaction existing = transactionRepositoryPort.findByIdAndAccount(id, account)
                .filter(Transaction::isActive)
                .orElseThrow(() -> new TransactionNotFoundException(id));

        existing.setAmount(transaction.getAmount());
        existing.setMerchant(transaction.getMerchant());
        existing.setUpdatedAt(LocalDateTime.now());

        return transactionRepositoryPort.save(existing);
    }

    @Override
    public boolean delete(int id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepositoryPort.findByEmail(username);

        Transaction transaction = transactionRepositoryPort.findByIdAndAccount(id, account)
                .orElseThrow(() -> new TransactionNotFoundException(id));

        if (!transaction.isActive()) {
            throw new TransactionNotFoundException(id);
        }

        transaction.setActive(false);
        transactionRepositoryPort.save(transaction);
        return true;
    }

}
