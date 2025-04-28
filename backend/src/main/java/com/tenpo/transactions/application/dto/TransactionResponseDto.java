package com.tenpo.transactions.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionResponseDto {
    private int id;
    private int amount;
    private String merchant;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean active;
}
