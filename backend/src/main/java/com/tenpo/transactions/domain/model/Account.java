package com.tenpo.transactions.domain.model;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    private int id;
    private String fullName;
    private String email;
    private String password;
    private Instant createdAt;
    private boolean active;
}
