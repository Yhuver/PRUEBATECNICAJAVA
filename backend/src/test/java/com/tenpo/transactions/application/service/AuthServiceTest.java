package com.tenpo.transactions.application.service;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.AuthTokenPort;
import com.tenpo.transactions.application.port.out.PasswordEncoderPort;
import com.tenpo.transactions.application.result.AuthResult;

import com.tenpo.transactions.domain.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private AuthTokenPort authTokenPort;

    @Mock
    private PasswordEncoderPort passwordEncoderPort;

    @Mock
    private AccountRepositoryPort accountRepositoryPort;

    @InjectMocks
    private AuthService authService;

    private Account testAccount;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configurar una cuenta de prueba
        testAccount = new Account();
        testAccount.setId(1);
        testAccount.setEmail("test@example.com");
        testAccount.setFullName("Test User");
        testAccount.setPassword("hashedPassword");
        testAccount.setActive(true);
        testAccount.setCreatedAt(Instant.now());
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnAuthResult() {
        // Arrange
        String email = "test@example.com";
        String rawPassword = "password123";
        String hashedPassword = "hashedPassword";

        when(accountRepositoryPort.findByEmail(email)).thenReturn(testAccount);
        when(passwordEncoderPort.matches(rawPassword, hashedPassword)).thenReturn(true);
        when(authTokenPort.generateAccessToken(testAccount)).thenReturn("access-token");
        when(authTokenPort.generateRefreshToken(testAccount)).thenReturn("refresh-token");

        // Act
        AuthResult result = authService.authenticate(email, rawPassword);

        // Assert
        assertNotNull(result);
        assertEquals("access-token", result.getAccessToken());
        assertEquals("refresh-token", result.getRefreshToken());
        verify(accountRepositoryPort).findByEmail(email);
        verify(passwordEncoderPort).matches(rawPassword, hashedPassword);
        verify(authTokenPort).generateAccessToken(testAccount);
        verify(authTokenPort).generateRefreshToken(testAccount);
    }

    @Test
    void authenticate_WithInvalidEmail_ShouldThrowBadCredentialsException() {
        // Arrange
        String email = "nonexistent@example.com";
        String rawPassword = "password123";

        when(accountRepositoryPort.findByEmail(email)).thenReturn(null);

        // Act & Assert
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> {
            authService.authenticate(email, rawPassword);
        });

        assertEquals("Invalid credentials", exception.getMessage());
        verify(accountRepositoryPort).findByEmail(email);
        verify(passwordEncoderPort, never()).matches(anyString(), anyString());
    }

    @Test
    void authenticate_WithInvalidPassword_ShouldThrowBadCredentialsException() {
        // Arrange
        String email = "test@example.com";
        String rawPassword = "wrongPassword";
        String hashedPassword = "hashedPassword";

        when(accountRepositoryPort.findByEmail(email)).thenReturn(testAccount);
        when(passwordEncoderPort.matches(rawPassword, hashedPassword)).thenReturn(false);

        // Act & Assert
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> {
            authService.authenticate(email, rawPassword);
        });

        assertEquals("Invalid credentials", exception.getMessage());
        verify(accountRepositoryPort).findByEmail(email);
        verify(passwordEncoderPort).matches(rawPassword, hashedPassword);
        verify(authTokenPort, never()).generateAccessToken(any());
    }

    @Test
    void register_WithNewEmail_ShouldSaveAccountAndReturnAuthResult() {
        // Arrange
        Account newAccount = new Account();
        newAccount.setEmail("new@example.com");
        newAccount.setFullName("New User");
        newAccount.setPassword("plainPassword");

        when(accountRepositoryPort.existsByEmail(newAccount.getEmail())).thenReturn(false);
        when(passwordEncoderPort.encode("plainPassword")).thenReturn("hashedPassword");
        when(accountRepositoryPort.save(any(Account.class))).thenReturn(newAccount);
        when(authTokenPort.generateAccessToken(any(Account.class))).thenReturn("access-token");
        when(authTokenPort.generateRefreshToken(any(Account.class))).thenReturn("refresh-token");

        // Act
        AuthResult result = authService.register(newAccount);

        // Assert
        assertNotNull(result);
        assertEquals("access-token", result.getAccessToken());
        assertEquals("refresh-token", result.getRefreshToken());
        verify(accountRepositoryPort).existsByEmail(newAccount.getEmail());
        verify(passwordEncoderPort).encode("plainPassword");

        // Verificar que se guarde con contraseña hash y cuenta activa
        verify(accountRepositoryPort).save(argThat(account ->
                "hashedPassword".equals(account.getPassword()) && account.isActive()
        ));
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Arrange
        Account existingAccount = new Account();
        existingAccount.setEmail("existing@example.com");
        existingAccount.setPassword("password");

        when(accountRepositoryPort.existsByEmail(existingAccount.getEmail())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(existingAccount);
        });

        assertTrue(exception.getMessage().contains("already exists"));
        verify(accountRepositoryPort).existsByEmail(existingAccount.getEmail());
        verify(accountRepositoryPort, never()).save(any(Account.class));
    }

    @Test
    void refreshAccessToken_WithValidToken_ShouldReturnNewAccessToken() {
        // Arrange
        String validToken = "valid-refresh-token";
        String email = "test@example.com";

        when(authTokenPort.extractUsername(validToken)).thenReturn(email);
        when(authTokenPort.isValid(validToken)).thenReturn(true);
        when(accountRepositoryPort.findByEmail(email)).thenReturn(testAccount);
        when(authTokenPort.generateAccessToken(testAccount)).thenReturn("new-access-token");

        // Act
        String newToken = authService.refreshAccessToken(validToken);

        // Assert
        assertEquals("new-access-token", newToken);
        verify(authTokenPort).extractUsername(validToken);
        verify(authTokenPort).isValid(validToken);
        verify(accountRepositoryPort).findByEmail(email);
        verify(authTokenPort).generateAccessToken(testAccount);
    }

    @Test
    void refreshAccessToken_WithInvalidToken_ShouldThrowException() {
        // Arrange
        String invalidToken = "invalid-token";
        String email = "test@example.com";

        when(authTokenPort.extractUsername(invalidToken)).thenReturn(email);
        when(authTokenPort.isValid(invalidToken)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.refreshAccessToken(invalidToken);
        });

        assertTrue(exception.getMessage().contains("expired or is invalid"));
        verify(authTokenPort).extractUsername(invalidToken);
        verify(authTokenPort).isValid(invalidToken);
        verify(accountRepositoryPort, never()).findByEmail(anyString());
    }

    @Test
    void refreshAccessToken_WithNonExistingAccount_ShouldThrowException() {
        // Arrange
        String validToken = "valid-token";
        String email = "nonexistent@example.com";

        when(authTokenPort.extractUsername(validToken)).thenReturn(email);
        when(authTokenPort.isValid(validToken)).thenReturn(true);
        when(accountRepositoryPort.findByEmail(email)).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.refreshAccessToken(validToken);
        });

        assertTrue(exception.getMessage().contains("Account not found"));
        verify(authTokenPort).extractUsername(validToken);
        verify(authTokenPort).isValid(validToken);
        verify(accountRepositoryPort).findByEmail(email);
    }

    @Test
    void checkSession_WithValidToken_ShouldReturnTrue() {
        // Arrange
        String validToken = "valid-token";
        when(authTokenPort.isValid(validToken)).thenReturn(true);

        // Act
        boolean result = authService.checkSession(validToken);

        // Assert
        assertTrue(result);
        verify(authTokenPort).isValid(validToken);
    }

    @Test
    void checkSession_WithInvalidToken_ShouldReturnFalse() {
        // Arrange
        String invalidToken = "invalid-token";
        when(authTokenPort.isValid(invalidToken)).thenReturn(false);

        // Act
        boolean result = authService.checkSession(invalidToken);

        // Assert
        assertFalse(result);
        verify(authTokenPort).isValid(invalidToken);
    }
}