package com.tenpo.transactions.application.service;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.TransactionRepositoryPort;
import com.tenpo.transactions.application.port.out.SecurityServicePort;
import com.tenpo.transactions.domain.exception.AccountNotFoundException;
import com.tenpo.transactions.domain.exception.TransactionLimitExceededException;
import com.tenpo.transactions.domain.exception.TransactionNotFoundException;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService implements TransactionUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final AccountRepositoryPort accountRepositoryPort;
    private final SecurityServicePort securityServicePort;

    public TransactionService (
            TransactionRepositoryPort transactionRepositoryPort,
            AccountRepositoryPort accountRepositoryPort,
            SecurityServicePort securityServicePort
    ) {
        this.transactionRepositoryPort = transactionRepositoryPort;
        this.accountRepositoryPort = accountRepositoryPort;
        this.securityServicePort = securityServicePort;
    }

    private Account getAuthenticatedAccount() {
        String username = securityServicePort.getAuthenticatedUsername();
        Account account = accountRepositoryPort.findByEmail(username);
        if (account == null) {
            throw new AccountNotFoundException("Cuenta no encontrada para el usuario " + username);
        }
        return account;
    }

    @Override
    public List<Transaction> findAll() {
        Account account = getAuthenticatedAccount();
        return transactionRepositoryPort.findAllByAccount(account);
    }

    @Override
    public Optional<Transaction> getById(int id) {
        Account account = getAuthenticatedAccount();
        return transactionRepositoryPort.findByIdAndAccount(id, account);
    }

    @Override
    @Transactional
    public Transaction save(Transaction transaction) {
        Account account = getAuthenticatedAccount();

        int activeCount = transactionRepositoryPort.countActiveByAccount(account);

        if (activeCount >= 200) {
            throw new TransactionLimitExceededException();
        }
        transaction.setActive(true);
        transaction.setAccount(account);

        if (transaction.getCreatedAt() == null){
            transaction.setCreatedAt(Instant.now());
        }

        return transactionRepositoryPort.save(transaction);
    }

    @Override
    public Transaction update(int id, Transaction transaction) {
        Account account = getAuthenticatedAccount();

        Transaction existing = transactionRepositoryPort.findByIdAndAccount(id, account)
                .filter(Transaction::isActive)
                .orElseThrow(() -> new TransactionNotFoundException(id));

        existing.setAmount(transaction.getAmount());
        existing.setMerchant(transaction.getMerchant());
        existing.setUpdatedAt(Instant.now());

        return transactionRepositoryPort.save(existing);
    }

    @Override
    public boolean delete(int id) {
        Account account = getAuthenticatedAccount();

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
