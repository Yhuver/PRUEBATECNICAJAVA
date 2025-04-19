package com.tenpo.transactions.domain.port.output.persistence;

import com.tenpo.transactions.domain.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {}
