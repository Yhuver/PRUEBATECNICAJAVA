package com.tenpo.transactions.application.service;


import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.SecurityServicePort;
import com.tenpo.transactions.application.port.out.TransactionRepositoryPort;
import com.tenpo.transactions.domain.exception.TransactionNotFoundException;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TransactionUseCaseTest {

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @Mock
    private AccountRepositoryPort accountRepositoryPort;

    @Mock
    private SecurityServicePort securityServicePort;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction transaction;
    private Account account;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        account = new Account();
        account.setId(1);
        account.setFullName("testuser");
        account.setEmail("test@gmail.com");
        account.setPassword("testpassword");
        account.setActive(true);
        account.setCreatedAt(Instant.now());

        transaction = new Transaction();
        transaction.setId(1);
        transaction.setAmount(100);
        transaction.setMerchant("Test Transaction");
        transaction.setCreatedAt(Instant.now());
        transaction.setAccount(account);

        when(securityServicePort.getAuthenticatedUsername()).thenReturn("testuser");
        when(accountRepositoryPort.findByEmail("testuser")).thenReturn(account);
    }

    @Test
    void findAll_ShouldReturnAllTransactionsForAuthenticatedUser() {
        List<Transaction> expectedTransactions = Collections.singletonList(transaction);
        when(transactionRepositoryPort.findAllByAccount(account)).thenReturn(expectedTransactions);

        List<Transaction> result = transactionService.findAll();

        assertEquals(expectedTransactions.size(), result.size());
        assertEquals(expectedTransactions.getFirst(), result.getFirst());
        verify(transactionRepositoryPort).findAllByAccount(account);
    }

    @Test
    void getById_ExistingId_ShouldReturnTransaction() {
        when(transactionRepositoryPort.findByIdAndAccount(transaction.getId(), account)).thenReturn(Optional.of(transaction));

        Optional<Transaction> result = transactionService.getById(transaction.getId());

        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());
        verify(transactionRepositoryPort).findByIdAndAccount(transaction.getId(), account);
    }

    @Test
    void getById_NonExistingId_ShouldReturnEmptyOptional() {
        int nonExistingId = 999;
        when(transactionRepositoryPort.findByIdAndAccount(nonExistingId, account)).thenReturn(Optional.empty());

        Optional<Transaction> result = transactionService.getById(nonExistingId);

        assertFalse(result.isPresent());
        verify(transactionRepositoryPort).findByIdAndAccount(nonExistingId, account);
    }

    @Test
    void save_ValidTransaction_ShouldSaveAndReturnTransaction() {
        when(transactionRepositoryPort.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.save(transaction);

        assertNotNull(result);
        assertEquals(transaction, result);
        verify(transactionRepositoryPort).save(transaction);
    }

    @Test
    void update_ExistingTransaction_ShouldUpdateAndReturnTransaction() {
        transaction.setActive(true);

        Transaction updatedTransaction = new Transaction();
        updatedTransaction.setId(transaction.getId());
        updatedTransaction.setAmount(200);
        updatedTransaction.setMerchant("Updated Transaction");
        updatedTransaction.setAccount(account);

        when(transactionRepositoryPort.findByIdAndAccount(transaction.getId(), account))
                .thenReturn(Optional.of(transaction));
        when(transactionRepositoryPort.save(any(Transaction.class)))
                .thenReturn(updatedTransaction);

        Transaction result = transactionService.update(transaction.getId(), updatedTransaction);

        assertNotNull(result);
        assertEquals(updatedTransaction.getAmount(), result.getAmount());
        assertEquals(updatedTransaction.getMerchant(), result.getMerchant());
        verify(transactionRepositoryPort).findByIdAndAccount(transaction.getId(), account);
        verify(transactionRepositoryPort).save(any(Transaction.class));
    }

    @Test
    void delete_ExistingId_ShouldReturnTrue() {
        transaction.setActive(true);
        when(transactionRepositoryPort.findByIdAndAccount(transaction.getId(), account))
                .thenReturn(Optional.of(transaction));
        when(transactionRepositoryPort.save(any(Transaction.class)))
                .thenReturn(transaction);

        boolean result = transactionService.delete(transaction.getId());

        assertTrue(result);
        verify(transactionRepositoryPort).findByIdAndAccount(transaction.getId(), account);
        verify(transactionRepositoryPort).save(any(Transaction.class));
        assertFalse(transaction.isActive());
    }

    @Test
    void delete_NonExistingId_ShouldThrowException() {
        int nonExistingId = 999;
        when(transactionRepositoryPort.findByIdAndAccount(nonExistingId, account))
                .thenReturn(Optional.empty());

        assertThrows(TransactionNotFoundException.class, () -> {
            transactionService.delete(nonExistingId);
        });
        verify(transactionRepositoryPort).findByIdAndAccount(nonExistingId, account);
        verify(transactionRepositoryPort, never()).save(any(Transaction.class));
    }

    @Test
    void delete_InactiveTransaction_ShouldThrowException() {
        transaction.setActive(false);
        when(transactionRepositoryPort.findByIdAndAccount(transaction.getId(), account))
                .thenReturn(Optional.of(transaction));

        assertThrows(TransactionNotFoundException.class, () -> {
            transactionService.delete(transaction.getId());
        });
        verify(transactionRepositoryPort).findByIdAndAccount(transaction.getId(), account);
        verify(transactionRepositoryPort, never()).save(any(Transaction.class));
    }
}