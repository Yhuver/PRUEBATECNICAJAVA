package com.tenpo.transactions.application.result;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResult {
    private String accessToken;
    private String refreshToken;
}
