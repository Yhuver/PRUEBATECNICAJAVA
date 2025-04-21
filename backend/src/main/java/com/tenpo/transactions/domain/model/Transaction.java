package com.tenpo.transactions.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Data
public class Transaction {
    private int id;
    private int amount;
    private String merchant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Account account;
    private boolean active;
}
