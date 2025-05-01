package com.tenpo.transactions.infrastructure.adapter.out.jwt;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.security.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtTokenAdapterTest {

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private JwtTokenAdapter jwtTokenAdapter;

    private Account account;
    private String mockAccessToken;
    private String mockRefreshToken;

    @BeforeEach
    public void setUp() {
        account = new Account();
        account.setId(1);
        account.setEmail("test@example.com");
        account.setFullName("Test User");
        account.setPassword("password123");
        account.setActive(true);
        account.setCreatedAt(Instant.now());

        mockAccessToken = "mock.access.token";
        mockRefreshToken = "mock.refresh.token";
    }

    @Test
    void generateAccessToken_ShouldCallJwtServiceAndReturnToken() {
        
        when(jwtService.generateAccessToken(any(UserDetails.class))).thenReturn(mockAccessToken);

        
        String result = jwtTokenAdapter.generateAccessToken(account);

        
        assertEquals(mockAccessToken, result);
        verify(jwtService, times(1)).generateAccessToken(any(AccountToUserDetailsAdapter.class));
    }

    @Test
    void generateRefreshToken_ShouldCallJwtServiceAndReturnToken() {
        
        when(jwtService.generateRefreshToken(any(UserDetails.class))).thenReturn(mockRefreshToken);

        
        String result = jwtTokenAdapter.generateRefreshToken(account);

        
        assertEquals(mockRefreshToken, result);
        verify(jwtService, times(1)).generateRefreshToken(any(AccountToUserDetailsAdapter.class));
    }

    @Test
    void isValid_WithValidToken_ShouldReturnTrue() {
        
        String validToken = "valid.jwt.token";
        when(jwtService.validateJwtToken(validToken)).thenReturn(true);

        
        boolean result = jwtTokenAdapter.isValid(validToken);

        
        assertTrue(result);
        verify(jwtService, times(1)).validateJwtToken(validToken);
    }

    @Test
    void isValid_WithInvalidToken_ShouldReturnFalse() {
        
        String invalidToken = "invalid.jwt.token";
        when(jwtService.validateJwtToken(invalidToken)).thenReturn(false);

        
        boolean result = jwtTokenAdapter.isValid(invalidToken);

        
        assertFalse(result);
        verify(jwtService, times(1)).validateJwtToken(invalidToken);
    }

    @Test
    void extractUsername_ShouldCallJwtServiceAndReturnUsername() {
        
        String token = "jwt.token.with.username";
        String expectedUsername = "test@example.com";
        when(jwtService.getUsernameFromToken(token)).thenReturn(expectedUsername);

        
        String result = jwtTokenAdapter.extractUsername(token);

        
        assertEquals(expectedUsername, result);
        verify(jwtService, times(1)).getUsernameFromToken(token);
    }

    @Test
    void extractUsername_WithInvalidToken_ShouldReturnWhateverJwtServiceReturns() {
        
        String invalidToken = "invalid.token";
        when(jwtService.getUsernameFromToken(invalidToken)).thenReturn(null);

        
        String result = jwtTokenAdapter.extractUsername(invalidToken);

        
        assertNull(result);
        verify(jwtService, times(1)).getUsernameFromToken(invalidToken);
    }

    @Test
    void constructor_ShouldInitializeWithJwtService() {
        
        JwtService newJwtService = mock(JwtService.class);
        
        
        JwtTokenAdapter adapter = new JwtTokenAdapter(newJwtService);
        
        
        assertNotNull(adapter);
        // Verificamos indirectamente que se usa el servicio pasado al constructor
        // llamando a uno de los métodos y verificando que se delega al servicio
        adapter.isValid("token");
        verify(newJwtService, times(1)).validateJwtToken("token");
    }
}