package com.tenpo.transactions.infrastructure.input.dto;

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
    @NotNull(message = "TenpistaName is required")
    private String tenpistaName;
    // @NotNull(message = "")
    // private int accountId;
}
