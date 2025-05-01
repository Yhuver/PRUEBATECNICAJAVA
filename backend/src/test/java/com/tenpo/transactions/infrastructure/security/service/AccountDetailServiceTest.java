package com.tenpo.transactions.infrastructure.security.service;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.domain.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AccountDetailServiceTest {

    @Mock
    private AccountRepositoryPort accountRepositoryPort;

    @InjectMocks
    private AccountDetailService accountDetailService;

    private Account testAccount;
    private final String testEmail = "usuario@test.com";
    private final String testPassword = "password123";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testAccount = new Account();
        testAccount.setId(1);
        testAccount.setEmail(testEmail);
        testAccount.setFullName("Usuario de Prueba");
        testAccount.setPassword(testPassword);
        testAccount.setActive(true);
        testAccount.setCreatedAt(Instant.now());
    }

    @Test
    void loadUserByUsername_WithExistingEmail_ShouldReturnUserDetails() {
        when(accountRepositoryPort.findByEmail(testEmail)).thenReturn(testAccount);

        UserDetails userDetails = accountDetailService.loadUserByUsername(testEmail);

        assertNotNull(userDetails);
        assertEquals(testEmail, userDetails.getUsername());
        assertEquals(testPassword, userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().isEmpty());

        verify(accountRepositoryPort, times(1)).findByEmail(testEmail);
    }

    @Test
    void loadUserByUsername_WithNonExistingEmail_ShouldThrowUsernameNotFoundException() {
        String nonExistingEmail = "noexiste@test.com";
        when(accountRepositoryPort.findByEmail(nonExistingEmail)).thenReturn(null);

        UsernameNotFoundException exception = assertThrows(
            UsernameNotFoundException.class, 
            () -> accountDetailService.loadUserByUsername(nonExistingEmail)
        );

        assertTrue(exception.getMessage().contains(nonExistingEmail));
        verify(accountRepositoryPort, times(1)).findByEmail(nonExistingEmail);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserWithEmptyAuthorities() {
        when(accountRepositoryPort.findByEmail(testEmail)).thenReturn(testAccount);

        UserDetails userDetails = accountDetailService.loadUserByUsername(testEmail);

        assertTrue(userDetails.getAuthorities().isEmpty());
    }

}