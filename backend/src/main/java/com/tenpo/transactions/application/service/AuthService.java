package com.tenpo.transactions.application.service;

import com.tenpo.transactions.application.port.in.AuthUseCase;
import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.AuthTokenPort;
import com.tenpo.transactions.application.port.out.PasswordEncoderPort;
import com.tenpo.transactions.domain.exception.UsernameAlreadyExistsException;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.infrastructure.adapter.out.jwt.JwtTokenAdapter;
import com.tenpo.transactions.infrastructure.security.service.AccountDetailService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthUseCase {

    private final AuthTokenPort authTokenPort;
    private final AccountDetailService userDetailsService;
    private final PasswordEncoderPort passwordEncoderPort;
    private final AccountRepositoryPort authRepositoryPort;
    private final JwtTokenAdapter jwtTokenAdapter;

    public AuthService(
            AuthTokenPort authTokenPort, AccountDetailService userDetailsService,
            PasswordEncoderPort passwordEncoderPort,
            AccountRepositoryPort authRepositoryPort,
            JwtTokenAdapter jwtTokenAdapter) {
        this.authTokenPort = authTokenPort;
        this.userDetailsService = userDetailsService;
        this.passwordEncoderPort = passwordEncoderPort;
        this.authRepositoryPort = authRepositoryPort;
        this.jwtTokenAdapter = jwtTokenAdapter;
    }

    @Override
    public AuthResult authenticate(String username, String password) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!isPasswordValid(userDetails, password))
            throw new BadCredentialsException("Invalid credentials");

        Account account = new Account();
        account.setEmail(userDetails.getUsername());
        account.setPassword(userDetails.getPassword());
        account.setActive(true);

        String accessToken = authTokenPort.generateToken(account);
        String refreshToken = authTokenPort.generateRefreshToken(account);

        return new AuthResult(accessToken, refreshToken);
    }

    @Override
    public AuthResult register(Account account) {
        if (authRepositoryPort.existsByEmail(account.getEmail())) {
            throw new UsernameAlreadyExistsException();
        }
        account.setPassword(passwordEncoderPort.encode(account.getPassword()));

        Account saved = authRepositoryPort.save(account);
        String accessToken = authTokenPort.generateToken(saved);
        String refreshToken = authTokenPort.generateRefreshToken(saved);

        return new AuthResult(accessToken, refreshToken);
    }

    @Override
    public AuthResult refreshToken(String refresh) {
        try {
            String username = jwtTokenAdapter.extractUsername(refresh);

            Account account = authRepositoryPort
                    .findByEmail(username);

            String newAccessToken = jwtTokenAdapter.generateToken(account);
            String newRefreshToken = jwtTokenAdapter.generateRefreshToken(account);

            return AuthResult.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }


    private boolean isPasswordValid(UserDetails userDetails, String password) {
        return passwordEncoderPort.matches(password, userDetails.getPassword());
    }
}
