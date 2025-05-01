package com.tenpo.transactions.infrastructure.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponse {
    private String timestamp;
    private int status;
    private String errorCode;
    private Map<String, String> errors;
}
