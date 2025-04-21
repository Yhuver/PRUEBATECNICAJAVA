package com.tenpo.transactions.application.dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class AuthRequestDto {
    private String username;
    private String password;
}
