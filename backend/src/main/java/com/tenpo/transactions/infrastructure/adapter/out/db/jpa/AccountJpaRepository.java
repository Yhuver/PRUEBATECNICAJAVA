package com.tenpo.transactions.infrastructure.adapter.out.db.jpa;

import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountJpaRepository extends JpaRepository<AccountEntity, Integer> {
    AccountEntity findByUsername(String username);
    boolean existsByUsername(String username);
}
