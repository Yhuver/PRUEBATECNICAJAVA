package com.tenpo.transactions.infrastructure.adapter.out.jwt;

import com.tenpo.transactions.application.port.out.AuthTokenPort;
import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.security.service.JwtService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenAdapter implements AuthTokenPort {

    private final JwtService jwtService;

    public JwtTokenAdapter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public String generateAccessToken(Account account) {
        UserDetails userDetails = new AccountToUserDetailsAdapter(account);
        return jwtService.generateAccessToken(userDetails);
    }

    @Override
    public String generateRefreshToken(Account account) {
        UserDetails userDetails = new AccountToUserDetailsAdapter(account);
        return jwtService.generateRefreshToken(userDetails);
    }

    @Override
    public boolean isValid(String token) {
        return jwtService.validateJwtToken(token);
    }

    @Override
    public String extractUsername(String token) {
        return jwtService.getUsernameFromToken(token);
    }
}
