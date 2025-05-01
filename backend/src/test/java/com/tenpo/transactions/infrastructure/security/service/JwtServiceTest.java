package com.tenpo.transactions.infrastructure.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    @Spy
    @InjectMocks
    private JwtService jwtService;

    private UserDetails userDetails;
    private SecretKey testSecretKey;
    private final String TEST_SECRET_KEY = "testSecretKeyNeedsToBeVeryLongForHmacSha256Algorithm";
    private final int TEST_ACCESS_TOKEN_EXPIRATION = 3600000;
    private final long TEST_REFRESH_TOKEN_EXPIRATION = 86400000;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        userDetails = new User("test@example.com", "password", new ArrayList<>());
        
        ReflectionTestUtils.setField(jwtService, "SECRET_KEY", TEST_SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "ACCESS_TOKEN_EXPIRATION", TEST_ACCESS_TOKEN_EXPIRATION);
        ReflectionTestUtils.setField(jwtService, "REFRESH_TOKEN_EXPIRATION", TEST_REFRESH_TOKEN_EXPIRATION);
        
        testSecretKey = Keys.hmacShaKeyFor(TEST_SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        ReflectionTestUtils.setField(jwtService, "jwtSecretKey", testSecretKey);
    }

    @Test
    void generateAccessToken_ShouldReturnValidToken() {
        String token = jwtService.generateAccessToken(userDetails);
        
        assertNotNull(token);
        assertTrue(token.length() > 0);
        
        Claims claims = Jwts.parser()
                .verifyWith(testSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
                
        assertEquals(userDetails.getUsername(), claims.getSubject());
        assertEquals("access", claims.get("type"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
        
        assertTrue(claims.getExpiration().after(new Date()));
    }

    @Test
    void generateRefreshToken_ShouldReturnValidToken() {
        String token = jwtService.generateRefreshToken(userDetails);
        
        assertNotNull(token);
        assertTrue(token.length() > 0);
        
        Claims claims = Jwts.parser()
                .verifyWith(testSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
                
        assertEquals(userDetails.getUsername(), claims.getSubject());
        assertEquals("refresh", claims.get("type"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiration());
        
        Date refreshExpiration = claims.getExpiration();
        assertTrue(refreshExpiration.after(new Date()));
        
        String accessToken = jwtService.generateAccessToken(userDetails);
        Date accessExpiration = Jwts.parser()
                .verifyWith(testSecretKey)
                .build()
                .parseSignedClaims(accessToken)
                .getPayload()
                .getExpiration();
                
        assertTrue(refreshExpiration.after(accessExpiration));
    }

    @Test
    void getUsernameFromToken_WithValidToken_ShouldReturnUsername() {
        String token = jwtService.generateAccessToken(userDetails);
        
        String username = jwtService.getUsernameFromToken(token);
        
        assertEquals(userDetails.getUsername(), username);
    }

    @Test
    void getUsernameFromToken_WithInvalidToken_ShouldThrowException() {
        String invalidToken = "invalid.token.string";
        
        Exception exception = assertThrows(RuntimeException.class, () -> {
            jwtService.getUsernameFromToken(invalidToken);
        });
        
        assertTrue(exception.getMessage().contains("Invalid JWT Token"));
    }

    @Test
    void validateJwtToken_WithValidToken_ShouldReturnTrue() {
        String token = jwtService.generateAccessToken(userDetails);
        
        boolean isValid = jwtService.validateJwtToken(token);
        
        assertTrue(isValid);
    }

    @Test
    void validateJwtToken_WithExpiredToken_ShouldReturnFalse() {
        String expiredToken = Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("type", "access")
                .issuedAt(new Date(System.currentTimeMillis() - 2000))
                .expiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(testSecretKey)
                .compact();
        
        boolean isValid = jwtService.validateJwtToken(expiredToken);
        
        assertFalse(isValid);
    }

    @Test
    void validateJwtToken_WithInvalidSignature_ShouldReturnFalse() {
        SecretKey differentKey = Keys.hmacShaKeyFor(
                "differentSecretKeyThatIsAlsoVeryLongForAlgorithm".getBytes(StandardCharsets.UTF_8));
        
        String tokenWithInvalidSignature = Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("type", "access")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60000))
                .signWith(differentKey)
                .compact();
        
        boolean isValid = jwtService.validateJwtToken(tokenWithInvalidSignature);
        
        assertFalse(isValid);
    }

    @Test
    void validateJwtToken_WithMalformedToken_ShouldReturnFalse() {
        String malformedToken = "not.a.jwt.token";
        
        boolean isValid = jwtService.validateJwtToken(malformedToken);
        
        assertFalse(isValid);
    }

    @Test
    void init_ShouldInitializeJwtSecretKey() {
        JwtService service = new JwtService();
        ReflectionTestUtils.setField(service, "SECRET_KEY", TEST_SECRET_KEY);
        
        service.init();
        
        SecretKey secretKey = (SecretKey) ReflectionTestUtils.getField(service, "jwtSecretKey");
        assertNotNull(secretKey);
    }
}