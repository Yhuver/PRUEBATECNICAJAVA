package com.tenpo.transactions.infrastructure.adapter.in.web;

import com.tenpo.transactions.application.dto.AuthRequestDto;
import com.tenpo.transactions.application.dto.RegisterRequestDto;
import com.tenpo.transactions.application.mapper.AccountDtoMapper;
import com.tenpo.transactions.application.port.in.AuthUseCase;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.security.config.SecureCookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final AccountDtoMapper authMapper;
    private final SecureCookieUtil secureCookieUtil;

    public AuthController(AuthUseCase authUseCase, AccountDtoMapper authMapper, SecureCookieUtil secureCookieUtil) {
        this.authUseCase = authUseCase;
        this.authMapper = authMapper;
        this.secureCookieUtil = secureCookieUtil;
    }

    @PostMapping("signin")
    public ResponseEntity<Void> authenticate(
            @RequestBody @Valid AuthRequestDto request,
            HttpServletResponse response
    ) {
        AuthResult result = authUseCase.authenticate(request.getEmail(), request.getPassword());
        secureCookieUtil.createAuthCookies(response, result.getAccessToken(), result.getRefreshToken());
        return ResponseEntity.ok()
                .build();
    }

    @PostMapping("signup")
    public ResponseEntity<Void> register(
            @RequestBody @Valid RegisterRequestDto request,
            HttpServletResponse response
    ) {
        Account toCreate = authMapper.toAuthDomain(request);
        AuthResult result = authUseCase.register(toCreate);
        secureCookieUtil.createAuthCookies(response, result.getAccessToken(), result.getRefreshToken());
        return ResponseEntity.ok()
                .build();
    }

    @PostMapping("logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        secureCookieUtil.deleteCookie(response,"accessToken");
        secureCookieUtil.deleteCookie(response,"refreshToken");
        return ResponseEntity.ok().build();
    }

    @PostMapping("refresh")
    public ResponseEntity<Void> refreshToken(
            @CookieValue("refreshToken") String refreshToken,
            HttpServletResponse response
    ) {
        String newAccessToken = authUseCase.refreshAccessToken(refreshToken);
        secureCookieUtil.createAccessTokenCookie(response,"accessToken", newAccessToken);
        return ResponseEntity.ok().build();
    }

    @GetMapping("check-session")
    public ResponseEntity<Boolean> checkSession(@CookieValue(value = "accessToken", required = false) String accessToken) {
        try {
            if (accessToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
            }
            boolean isActive = authUseCase.checkSession(accessToken);
            return isActive ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }

}