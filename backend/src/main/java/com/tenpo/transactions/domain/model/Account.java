package com.tenpo.transactions.domain.model;

import lombok.*;

import java.time.LocalDateTime;

@Data
public class Account {
    private int id;
    private String username;
    private String password;
    private LocalDateTime createdAt;
    private boolean active;
}
