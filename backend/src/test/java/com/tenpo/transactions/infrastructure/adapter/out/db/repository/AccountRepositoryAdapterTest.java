package com.tenpo.transactions.infrastructure.adapter.out.db.repository;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.jpa.AccountJpaRepository;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.AccountMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AccountRepositoryAdapterTest {

    @Mock
    private AccountMapper mapper;

    @Mock
    private AccountJpaRepository jpa;

    @InjectMocks
    private AccountRepositoryAdapter adapter;

    private AccountEntity accountEntity;
    private Account account;
    private final String testEmail = "test@example.com";
    private final String testName = "Test User";
    private final String testPassword = "password123";

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setId(1);
        accountEntity.setEmail(testEmail);
        accountEntity.setFullName(testName);
        accountEntity.setPassword(testPassword);
        accountEntity.setActive(true);
        accountEntity.setCreatedAt(Instant.now());
        accountEntity.setTransactions(new ArrayList<>());

        account = new Account();
        account.setId(1);
        account.setEmail(testEmail);
        account.setFullName(testName);
        account.setPassword(testPassword);
        account.setActive(true);
        account.setCreatedAt(Instant.now());
    }

    @Test
    void existsByEmail_WhenEmailExists_ShouldReturnTrue() {
        when(jpa.existsByEmail(testEmail)).thenReturn(true);

        boolean result = adapter.existsByEmail(testEmail);

        assertTrue(result);
        verify(jpa, times(1)).existsByEmail(testEmail);
    }

    @Test
    void existsByEmail_WhenEmailDoesNotExist_ShouldReturnFalse() {
        String nonExistentEmail = "nonexistent@example.com";
        when(jpa.existsByEmail(nonExistentEmail)).thenReturn(false);

        boolean result = adapter.existsByEmail(nonExistentEmail);

        assertFalse(result);
        verify(jpa, times(1)).existsByEmail(nonExistentEmail);
    }

    @Test
    void findByEmail_WhenEmailExists_ShouldReturnAccount() {
        when(jpa.findByEmail(testEmail)).thenReturn(accountEntity);
        when(mapper.toDomain(accountEntity)).thenReturn(account);

        Account result = adapter.findByEmail(testEmail);

        assertNotNull(result);
        assertEquals(testEmail, result.getEmail());
        assertEquals(testName, result.getFullName());
        assertEquals(testPassword, result.getPassword());
        verify(jpa, times(1)).findByEmail(testEmail);
        verify(mapper, times(1)).toDomain(accountEntity);
    }

    @Test
    void findByEmail_WhenEmailDoesNotExist_ShouldReturnNull() {
        String nonExistentEmail = "nonexistent@example.com";
        when(jpa.findByEmail(nonExistentEmail)).thenReturn(null);
        when(mapper.toDomain(null)).thenReturn(null);

        Account result = adapter.findByEmail(nonExistentEmail);

        assertNull(result);
        verify(jpa, times(1)).findByEmail(nonExistentEmail);
        verify(mapper, times(1)).toDomain(null);
    }

    @Test
    void save_ShouldSaveAccountAndReturnSavedAccount() {
        when(mapper.toEntity(account)).thenReturn(accountEntity);
        when(jpa.save(accountEntity)).thenReturn(accountEntity);
        when(mapper.toDomain(accountEntity)).thenReturn(account);

        Account result = adapter.save(account);

        assertNotNull(result);
        assertEquals(account.getId(), result.getId());
        assertEquals(account.getEmail(), result.getEmail());
        assertEquals(account.getFullName(), result.getFullName());
        verify(mapper, times(1)).toEntity(account);
        verify(jpa, times(1)).save(accountEntity);
        verify(mapper, times(1)).toDomain(accountEntity);
    }

    @Test
    void save_WhenAccountIsNull_ShouldReturnNull() {
        when(mapper.toEntity(null)).thenReturn(null);
        when(jpa.save(null)).thenReturn(null);
        when(mapper.toDomain(null)).thenReturn(null);
        
        Account result = adapter.save(null);
        
        assertNull(result);
        verify(mapper, times(1)).toEntity(null);
        verify(jpa, times(1)).save(null);
        verify(mapper, times(1)).toDomain(null);
    }
}