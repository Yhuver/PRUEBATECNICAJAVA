package com.tenpo.transactions.infrastructure.security.filter;

import com.tenpo.transactions.infrastructure.security.service.AccountDetailService;
import com.tenpo.transactions.infrastructure.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class AuthTokenFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private AccountDetailService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    private final String testEmail = "test@example.com";
    private final String validToken = "valid.jwt.token";
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userDetails = new User(testEmail, "password", new ArrayList<>());
        
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void doFilterInternal_WithAuthEndpoint_ShouldSkipTokenProcessing() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/auth/login");

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(filterChain, times(1)).doFilter(request, response);
        verify(jwtService, never()).getUsernameFromToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void doFilterInternal_WithNoCookies_ShouldContinueFilterChain() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        when(request.getCookies()).thenReturn(null);

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(filterChain, times(1)).doFilter(request, response);
        verify(jwtService, never()).getUsernameFromToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void doFilterInternal_WithNonJwtCookies_ShouldContinueFilterChain() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("theme", "dark"),
            new Cookie("language", "es")
        };
        when(request.getCookies()).thenReturn(cookies);

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(filterChain, times(1)).doFilter(request, response);
        verify(jwtService, never()).getUsernameFromToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void doFilterInternal_WithValidJwtToken_ShouldSetAuthentication() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("accessToken", validToken)
        };
        when(request.getCookies()).thenReturn(cookies);
        
        when(jwtService.getUsernameFromToken(validToken)).thenReturn(testEmail);
        when(userDetailsService.loadUserByUsername(testEmail)).thenReturn(userDetails);
        when(jwtService.validateJwtToken(validToken)).thenReturn(true);
        when(securityContext.getAuthentication()).thenReturn(null);

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(securityContext, times(1)).setAuthentication(any(Authentication.class));
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_WithInvalidJwtToken_ShouldNotSetAuthentication() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("accessToken", validToken)
        };
        when(request.getCookies()).thenReturn(cookies);
        
        when(jwtService.getUsernameFromToken(validToken)).thenReturn(testEmail);
        when(userDetailsService.loadUserByUsername(testEmail)).thenReturn(userDetails);
        when(jwtService.validateJwtToken(validToken)).thenReturn(false);
        when(securityContext.getAuthentication()).thenReturn(null);

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(securityContext, never()).setAuthentication(any(Authentication.class));
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_WithExistingAuthentication_ShouldSkipTokenProcessing() throws ServletException, IOException {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("accessToken", validToken)
        };
        when(request.getCookies()).thenReturn(cookies);
        
        Authentication existingAuth = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(existingAuth);

        
        authTokenFilter.doFilterInternal(request, response, filterChain);

        
        verify(jwtService, never()).getUsernameFromToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_WhenJwtServiceThrowsException_ShouldThrowException() {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("accessToken", validToken)
        };
        when(request.getCookies()).thenReturn(cookies);
        
        when(jwtService.getUsernameFromToken(validToken)).thenThrow(new RuntimeException("Invalid token"));
        when(securityContext.getAuthentication()).thenReturn(null);

        assertThrows(RuntimeException.class, () -> {
            authTokenFilter.doFilterInternal(request, response, filterChain);
        });
    }

    @Test
    void doFilterInternal_WhenUserDetailsServiceThrowsException_ShouldThrowException() {
        
        when(request.getServletPath()).thenReturn("/api/transactions");
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("accessToken", validToken)
        };
        when(request.getCookies()).thenReturn(cookies);
        
        when(jwtService.getUsernameFromToken(validToken)).thenReturn(testEmail);
        when(userDetailsService.loadUserByUsername(testEmail))
            .thenThrow(new UsernameNotFoundException("User not found with username: " + testEmail));
        when(securityContext.getAuthentication()).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            authTokenFilter.doFilterInternal(request, response, filterChain);
        });
    }

    @Test
    void getJwtFromCookies_WithNullCookies_ShouldReturnNull() throws Exception {
        
        when(request.getCookies()).thenReturn(null);
        
        java.lang.reflect.Method method = AuthTokenFilter.class.getDeclaredMethod("getJwtFromCookies", HttpServletRequest.class);
        method.setAccessible(true);
        
        
        String result = (String) method.invoke(authTokenFilter, request);
        
        
        assertNull(result);
    }

    @Test
    void getJwtFromCookies_WithNoAccessTokenCookie_ShouldReturnNull() throws Exception {
        
        Cookie[] cookies = new Cookie[] {
            new Cookie("otherCookie", "value")
        };
        when(request.getCookies()).thenReturn(cookies);
        
        java.lang.reflect.Method method = AuthTokenFilter.class.getDeclaredMethod("getJwtFromCookies", HttpServletRequest.class);
        method.setAccessible(true);
        
        
        String result = (String) method.invoke(authTokenFilter, request);
        
        
        assertNull(result);
    }

    @Test
    void getJwtFromCookies_WithAccessTokenCookie_ShouldReturnTokenValue() throws Exception {
        
        String tokenValue = "test.jwt.token";
        Cookie[] cookies = new Cookie[] {
            new Cookie("theme", "dark"),
            new Cookie("accessToken", tokenValue),
            new Cookie("language", "es")
        };
        when(request.getCookies()).thenReturn(cookies);
        
        java.lang.reflect.Method method = AuthTokenFilter.class.getDeclaredMethod("getJwtFromCookies", HttpServletRequest.class);
        method.setAccessible(true);
        
        
        String result = (String) method.invoke(authTokenFilter, request);
        
        
        assertEquals(tokenValue, result);
    }
}