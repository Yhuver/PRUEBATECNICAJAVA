package com.tenpo.transactions.infrastructure.input.controller;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.domain.port.input.AccountUseCase;
import com.tenpo.transactions.infrastructure.input.dto.TransactionResponseDto;
import com.tenpo.transactions.infrastructure.input.mapper.AccountMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/account")
@AllArgsConstructor
public class AccountController {

    private final AccountUseCase useCase;
    private final AccountMapper mapper;

    @GetMapping
    public ResponseEntity<List<TransactionResponseDto>> getAll() {
        return new ResponseEntity<>(
                HttpStatus.OK
        );
    }
}
