package com.tenpo.transactions.infrastructure.adapter.out.db.repository;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.TransactionEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.jpa.AccountJpaRepository;
import com.tenpo.transactions.infrastructure.adapter.out.db.jpa.TransactionJpaRepository;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.TransactionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionRepositoryAdapterTest {

    @Mock
    private TransactionMapper transactionMapper;

    @Mock
    private TransactionJpaRepository transactionRepositoryJpa;

    @Mock
    private AccountJpaRepository accountJpaRepository;

    @InjectMocks
    private TransactionRepositoryAdapter adapter;

    private Account account;
    private AccountEntity accountEntity;
    private Transaction transaction;
    private TransactionEntity transactionEntity;
    private List<TransactionEntity> transactionEntities;
    private List<Transaction> transactions;

    @BeforeEach
    void setUp() {
        account = new Account();
        account.setId(1);
        account.setEmail("test@example.com");
        account.setFullName("Test User");
        account.setPassword("password123");
        account.setActive(true);
        account.setCreatedAt(Instant.now());

        accountEntity = new AccountEntity();
        accountEntity.setId(1);
        accountEntity.setEmail("test@example.com");
        accountEntity.setFullName("Test User");
        accountEntity.setPassword("password123");
        accountEntity.setActive(true);
        accountEntity.setCreatedAt(Instant.now());
        accountEntity.setTransactions(new ArrayList<>());

        transaction = new Transaction();
        transaction.setId(1);
        transaction.setAmount(100);
        transaction.setMerchant("Tienda XYZ");
        transaction.setMerchant("Compra de prueba");
        transaction.setActive(true);
        transaction.setCreatedAt(Instant.now());
        transaction.setAccount(account);

        transactionEntity = new TransactionEntity();
        transactionEntity.setId(1);
        transactionEntity.setAmount(100);
        transactionEntity.setMerchant("Tienda XYZ");
        transactionEntity.setMerchant("Compra de prueba");
        transactionEntity.setActive(true);
        transactionEntity.setCreatedAt(Instant.now());
        transactionEntity.setAccount(accountEntity);

        transactionEntities = List.of(transactionEntity);
        transactions = List.of(transaction);
    }

    @Test
    void countActiveByAccount_ShouldReturnCorrectCount() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(accountEntity);
        when(transactionRepositoryJpa.countByAccountAndActiveTrue(accountEntity)).thenReturn(5);

        
        int count = adapter.countActiveByAccount(account);

        
        assertEquals(5, count);
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1)).countByAccountAndActiveTrue(accountEntity);
    }

    @Test
    void findById_WhenTransactionExists_ShouldReturnTransaction() {
        
        when(transactionRepositoryJpa.findById(anyInt())).thenReturn(Optional.of(transactionEntity));
        when(transactionMapper.toDomain(transactionEntity)).thenReturn(transaction);

        
        Optional<Transaction> result = adapter.findById(1);

        
        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());
        verify(transactionRepositoryJpa, times(1)).findById(1);
        verify(transactionMapper, times(1)).toDomain(transactionEntity);
    }

    @Test
    void findById_WhenTransactionDoesNotExist_ShouldReturnEmpty() {
        
        when(transactionRepositoryJpa.findById(anyInt())).thenReturn(Optional.empty());

        
        Optional<Transaction> result = adapter.findById(999);

        
        assertTrue(result.isEmpty());
        verify(transactionRepositoryJpa, times(1)).findById(999);
        verify(transactionMapper, never()).toDomain(any());
    }

    @Test
    void findByIdAndAccount_WhenTransactionExists_ShouldReturnTransaction() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(accountEntity);
        when(transactionRepositoryJpa.findByIdAndAccountAndActiveTrue(1, accountEntity))
                .thenReturn(Optional.of(transactionEntity));
        when(transactionMapper.toDomain(transactionEntity)).thenReturn(transaction);

        
        Optional<Transaction> result = adapter.findByIdAndAccount(1, account);

        
        assertTrue(result.isPresent());
        assertEquals(transaction, result.get());
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findByIdAndAccountAndActiveTrue(1, accountEntity);
        verify(transactionMapper, times(1)).toDomain(transactionEntity);
    }

    @Test
    void findByIdAndAccount_WhenTransactionDoesNotExist_ShouldReturnEmpty() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(accountEntity);
        when(transactionRepositoryJpa.findByIdAndAccountAndActiveTrue(999, accountEntity))
                .thenReturn(Optional.empty());

        
        Optional<Transaction> result = adapter.findByIdAndAccount(999, account);

        
        assertTrue(result.isEmpty());
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findByIdAndAccountAndActiveTrue(999, accountEntity);
        verify(transactionMapper, never()).toDomain(any());
    }

    @Test
    void findAllByAccount_ShouldReturnAllTransactions() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(accountEntity);
        when(transactionRepositoryJpa.findAllByAccountAndActiveTrue(accountEntity))
                .thenReturn(transactionEntities);
        when(transactionMapper.toDomain(transactionEntity)).thenReturn(transaction);

        
        List<Transaction> result = adapter.findAllByAccount(account);

        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(transaction, result.get(0));
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findAllByAccountAndActiveTrue(accountEntity);
        verify(transactionMapper, times(1)).toDomain(any(TransactionEntity.class));
    }

    @Test
    void findAllByAccount_WhenNoTransactions_ShouldReturnEmptyList() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(accountEntity);
        when(transactionRepositoryJpa.findAllByAccountAndActiveTrue(accountEntity))
                .thenReturn(List.of());

        
        List<Transaction> result = adapter.findAllByAccount(account);

        
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findAllByAccountAndActiveTrue(accountEntity);
        verify(transactionMapper, never()).toDomain(any());
    }

    @Test
    void save_ShouldSaveTransactionAndReturnSaved() {
        
        when(transactionMapper.toEntity(transaction)).thenReturn(transactionEntity);
        when(transactionRepositoryJpa.save(transactionEntity)).thenReturn(transactionEntity);
        when(transactionMapper.toDomain(transactionEntity)).thenReturn(transaction);

        
        Transaction result = adapter.save(transaction);

        
        assertNotNull(result);
        assertEquals(transaction, result);
        verify(transactionMapper, times(1)).toEntity(transaction);
        verify(transactionRepositoryJpa, times(1)).save(transactionEntity);
        verify(transactionMapper, times(1)).toDomain(transactionEntity);
    }

    @Test
    void save_WhenTransactionIsNull_ShouldHandleNullCase() {
        
        when(transactionMapper.toEntity(null)).thenReturn(null);
        when(transactionRepositoryJpa.save(null)).thenReturn(null);
        when(transactionMapper.toDomain(null)).thenReturn(null);

        
        Transaction result = adapter.save(null);

        
        assertNull(result);
        verify(transactionMapper, times(1)).toEntity(null);
        verify(transactionRepositoryJpa, times(1)).save(null);
        verify(transactionMapper, times(1)).toDomain(null);
    }

    @Test
    void countActiveByAccount_WhenAccountNotFound_ShouldHandleNullAccountEntity() {
        
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(null);
        when(transactionRepositoryJpa.countByAccountAndActiveTrue(null)).thenReturn(0);

        
        int count = adapter.countActiveByAccount(account);

        
        assertEquals(0, count);
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1)).countByAccountAndActiveTrue(null);
    }

    @Test
    void findByIdAndAccount_WhenAccountNotFound_ShouldReturnEmpty() {
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(null);
        when(transactionRepositoryJpa.findByIdAndAccountAndActiveTrue(anyInt(), eq(null)))
                .thenReturn(Optional.empty());

        Optional<Transaction> result = adapter.findByIdAndAccount(1, account);

        assertTrue(result.isEmpty());
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findByIdAndAccountAndActiveTrue(1, null);
    }

    @Test
    void findAllByAccount_WhenAccountNotFound_ShouldReturnEmptyList() {
        when(accountJpaRepository.findByEmail(account.getEmail())).thenReturn(null);
        when(transactionRepositoryJpa.findAllByAccountAndActiveTrue(null))
                .thenReturn(List.of());

        List<Transaction> result = adapter.findAllByAccount(account);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(accountJpaRepository, times(1)).findByEmail(account.getEmail());
        verify(transactionRepositoryJpa, times(1))
                .findAllByAccountAndActiveTrue(null);
    }
}