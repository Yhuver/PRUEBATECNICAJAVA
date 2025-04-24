package com.tenpo.transactions.application.service;

import com.tenpo.transactions.application.port.in.AuthUseCase;
import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.application.port.out.AuthTokenPort;
import com.tenpo.transactions.application.port.out.PasswordEncoderPort;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.application.result.AuthResult;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthUseCase {

    private final AuthTokenPort authTokenPort;
    private final PasswordEncoderPort passwordEncoderPort;
    private final AccountRepositoryPort accountRepositoryPort;

    public AuthService(
            AuthTokenPort authTokenPort,
            PasswordEncoderPort passwordEncoderPort,
            AccountRepositoryPort accountRepositoryPort
         ) {
        this.authTokenPort = authTokenPort;
        this.passwordEncoderPort = passwordEncoderPort;
        this.accountRepositoryPort = accountRepositoryPort;
    }

    @Override
    public AuthResult authenticate(String email, String rawPassword) {
        Account account = accountRepositoryPort.findByEmail(email);
        if (account == null) {
            throw new BadCredentialsException("Invalid credentials");
        }

        boolean isValid = passwordEncoderPort.matches(rawPassword, account.getPassword());
        if (!isValid) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String accessToken = authTokenPort.generateToken(account);
        String refreshToken = authTokenPort.generateRefreshToken(account);

        return new AuthResult(accessToken, refreshToken);
    }


    @Override
    public AuthResult register(Account account) {
        if (accountRepositoryPort.existsByEmail(account.getEmail())) {
            throw new RuntimeException("Account with email " + account.getEmail() + " already exists");
        }

        String hashedPassword = passwordEncoderPort.encode(account.getPassword());
        account.setPassword(hashedPassword);
        account.setActive(true);

        accountRepositoryPort.save(account);

        String accessToken = authTokenPort.generateToken(account);
        String refreshToken = authTokenPort.generateRefreshToken(account);

        return new AuthResult(accessToken, refreshToken);
    }


    @Override
    public AuthResult refreshToken(String refresh) {
        try {
            String email = authTokenPort.extractUsername(refresh);

            Account account = accountRepositoryPort
                    .findByEmail(email);

            String newAccessToken = authTokenPort.generateToken(account);
            String newRefreshToken = authTokenPort.generateRefreshToken(account);

            return AuthResult.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to refresh token: " + e.getMessage());
        }
    }
}
