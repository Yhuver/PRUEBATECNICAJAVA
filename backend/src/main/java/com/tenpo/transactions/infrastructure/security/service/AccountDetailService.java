package com.tenpo.transactions.infrastructure.security.service;

import com.tenpo.transactions.application.port.out.AccountRepositoryPort;
import com.tenpo.transactions.domain.model.Account;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AccountDetailService implements UserDetailsService {

    private final AccountRepositoryPort accountRepositoryPort;

    public AccountDetailService(AccountRepositoryPort accountRepositoryPort) {
        this.accountRepositoryPort = accountRepositoryPort;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepositoryPort.findByEmail(email);
        if (account == null) {
            throw new UsernameNotFoundException("User not found with username: " + email);
        }
        return new User(account.getEmail(), account.getPassword(), Collections.emptyList());
    }
}
