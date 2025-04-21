package com.tenpo.transactions.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionResponseDto {
    private int id;
    private int amount;
    private String merchant;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int accountId;
    private boolean active;
}
