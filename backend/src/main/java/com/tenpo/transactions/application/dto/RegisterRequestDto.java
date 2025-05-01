package com.tenpo.transactions.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {
    @NotNull(message = "FullName is required")
    private String fullName;
    @NotNull(message = "Email is required")
    private String email;
    @NotNull(message = "Password is required")
    private String password;
}
