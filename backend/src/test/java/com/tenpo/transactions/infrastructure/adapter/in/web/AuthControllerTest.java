package com.tenpo.transactions.infrastructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenpo.transactions.application.dto.AuthRequestDto;
import com.tenpo.transactions.application.dto.RegisterRequestDto;
import com.tenpo.transactions.application.mapper.AccountDtoMapper;
import com.tenpo.transactions.application.port.in.AuthUseCase;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.security.config.SecureCookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthUseCase authUseCase;

    @Mock
    private AccountDtoMapper authMapper;

    @Mock
    private SecureCookieUtil secureCookieUtil;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void authenticate_ShouldReturnOk_WhenCredentialsAreValid() throws Exception {
        AuthRequestDto request = new AuthRequestDto("usuario@example.com", "password123");
        AuthResult authResult = AuthResult.builder()
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .build();

        when(authUseCase.authenticate(request.getEmail(), request.getPassword())).thenReturn(authResult);
        doNothing().when(secureCookieUtil).createAuthCookies(any(HttpServletResponse.class), anyString(), anyString());

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(authUseCase).authenticate(request.getEmail(), request.getPassword());
        verify(secureCookieUtil).createAuthCookies(any(HttpServletResponse.class), eq("access-token"), eq("refresh-token"));
    }

    @Test
    void register_ShouldReturnOk_WhenRegistrationIsSuccessful() throws Exception {
        RegisterRequestDto request = new RegisterRequestDto("John Doe", "usuario@example.com", "password123");
        Account account = new Account();
        AuthResult authResult = AuthResult.builder()
                .accessToken("access-token")
                .refreshToken("refresh-token")
                .build();

        when(authMapper.toAuthDomain(request)).thenReturn(account);
        when(authUseCase.register(account)).thenReturn(authResult);
        doNothing().when(secureCookieUtil).createAuthCookies(any(HttpServletResponse.class), anyString(), anyString());

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(authMapper).toAuthDomain(request);
        verify(authUseCase).register(account);
        verify(secureCookieUtil).createAuthCookies(any(HttpServletResponse.class), eq("access-token"), eq("refresh-token"));
    }

    @Test
    void logout_ShouldReturnOk_AndDeleteCookies() throws Exception {
        doNothing().when(secureCookieUtil).deleteCookie(any(HttpServletResponse.class), anyString());

        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isOk());

        verify(secureCookieUtil).deleteCookie(any(HttpServletResponse.class), eq("accessToken"));
        verify(secureCookieUtil).deleteCookie(any(HttpServletResponse.class), eq("refreshToken"));
    }

    @Test
    void refreshToken_ShouldReturnOk_WhenRefreshTokenIsValid() throws Exception {
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";

        when(authUseCase.refreshAccessToken(refreshToken)).thenReturn(newAccessToken);
        doNothing().when(secureCookieUtil).createAccessTokenCookie(any(HttpServletResponse.class), anyString(), anyString());

        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(new jakarta.servlet.http.Cookie("refreshToken", refreshToken)))
                .andExpect(status().isOk());

        verify(authUseCase).refreshAccessToken(refreshToken);
        verify(secureCookieUtil).createAccessTokenCookie(any(HttpServletResponse.class), eq("accessToken"), eq(newAccessToken));
    }

    @Test
    void checkSession_ShouldReturnTrue_WhenSessionIsActive() throws Exception {
        String accessToken = "valid-access-token";

        when(authUseCase.checkSession(accessToken)).thenReturn(true);

        mockMvc.perform(get("/api/auth/check-session")
                        .cookie(new jakarta.servlet.http.Cookie("accessToken", accessToken)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(authUseCase).checkSession(accessToken);
    }

    @Test
    void checkSession_ShouldReturnFalse_WhenSessionIsInactive() throws Exception {
        String accessToken = "invalid-access-token";

        when(authUseCase.checkSession(accessToken)).thenReturn(false);

        mockMvc.perform(get("/api/auth/check-session")
                        .cookie(new jakarta.servlet.http.Cookie("accessToken", accessToken)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("false"));

        verify(authUseCase).checkSession(accessToken);
    }

    @Test
    void checkSession_ShouldReturnUnauthorized_WhenAccessTokenIsNull() throws Exception {
        mockMvc.perform(get("/api/auth/check-session"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("false"));

        verifyNoInteractions(authUseCase);
    }

    @Test
    void checkSession_ShouldReturnUnauthorized_WhenExceptionOccurs() throws Exception {
        String accessToken = "token-causing-exception";

        when(authUseCase.checkSession(accessToken)).thenThrow(new RuntimeException("Error validating token"));

        mockMvc.perform(get("/api/auth/check-session")
                        .cookie(new jakarta.servlet.http.Cookie("accessToken", accessToken)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("false"));

        verify(authUseCase).checkSession(accessToken);
    }
}