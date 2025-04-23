package com.tenpo.transactions.application.service;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.adapter.out.db.repository.AccountRepositoryAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class LoginUtilityService {
    private final AccountRepositoryAdapter accountAdapter;

    public LoginUtilityService(AccountRepositoryAdapter accountAdapter) {
        this.accountAdapter = accountAdapter;
    }

    public UserDetails findMatch(String username) {
        Account account = accountAdapter.findByEmail(username);

        if (account != null) {
            return User.withUsername(account.getEmail())
                    .password(account.getPassword())
                    .build();
        }

        throw new RuntimeException("User not found: " + username);
    }
}
