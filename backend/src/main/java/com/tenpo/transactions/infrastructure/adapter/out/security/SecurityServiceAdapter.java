package com.tenpo.transactions.infrastructure.adapter.out.security;

import com.tenpo.transactions.application.port.out.SecurityServicePort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;


@Component
public class SecurityServiceAdapter implements SecurityServicePort {

    @Override
    public String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new AuthenticationCredentialsNotFoundException("Usuario no autenticado. No tienes permiso para realizar esta operación.");
        }
        return authentication.getName();
    }
}
