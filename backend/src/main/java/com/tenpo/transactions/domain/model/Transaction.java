package com.tenpo.transactions.domain.model;

import lombok.*;

import java.time.Instant;

@Data
public class Transaction {
    private int id;
    private int amount;
    private String merchant;
    private Instant createdAt;
    private Instant updatedAt;
    private Account account;
    private boolean active;
}
