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
    public String generateToken(Account account) {
        UserDetails userDetails = new AccountToUserDetailsAdapter(account);
        return jwtService.generateToken(userDetails);
    }

    @Override
    public String generateRefreshToken(Account account) {
        UserDetails userDetails = new AccountToUserDetailsAdapter(account);
        return jwtService.generateRefreshToken(userDetails);
    }

    @Override
    public boolean isTokenValid(String token) {
        return jwtService.validateJwtToken(token);
    }

    @Override
    public String extractUsername(String token) {
        return jwtService.getUsernameFromToken(token);
    }
}
