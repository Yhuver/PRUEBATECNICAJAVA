package com.tenpo.transactions.infrastructure.security.service;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.adapter.out.db.repository.AccountRepositoryAdapter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AccountDetailService implements UserDetailsService {

    private final AccountRepositoryAdapter accountAdapter;

    public AccountDetailService(AccountRepositoryAdapter accountAdapter) {
        this.accountAdapter = accountAdapter;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountAdapter.findByEmail(username);
        if (account == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new User(account.getEmail(), account.getPassword(), Collections.emptyList());
    }
}
