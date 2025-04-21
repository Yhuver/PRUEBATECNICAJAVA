package com.tenpo.transactions.infrastructure.adapter.out.db.jpa;

import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Integer> {
    List<TransactionEntity> findAllByAccountAndActiveTrue(AccountEntity account);
    Optional<TransactionEntity> findByIdAndAccountAndActiveTrue(int id, AccountEntity account);
}