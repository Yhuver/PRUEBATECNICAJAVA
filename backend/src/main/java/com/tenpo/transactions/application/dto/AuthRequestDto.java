package com.tenpo.transactions.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuthRequestDto {
    @NotNull(message="Email is required")
    private String email;
    @NotNull(message="Password is required")
    private String password;
}
