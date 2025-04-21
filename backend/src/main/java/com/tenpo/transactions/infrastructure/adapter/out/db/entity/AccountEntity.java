package com.tenpo.transactions.infrastructure.adapter.out.db.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Account")
public class AccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true)
    private String username;
    private String password;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private List<TransactionEntity> transactions;

    private LocalDateTime createdAt;
    private boolean active;
}
