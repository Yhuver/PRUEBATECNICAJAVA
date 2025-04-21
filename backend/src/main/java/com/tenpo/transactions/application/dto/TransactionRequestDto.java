package com.tenpo.transactions.application.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionRequestDto {
    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be greater than or equal to zero")
    private int amount;
    @NotNull(message = "Merchant is required")
    private String merchant;
}
