package com.tenpo.transactions.application.result;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResult {
    private String accessToken;
    private String refreshToken;
}
