package com.tenpo.transactions.infrastructure.adapter.in.web;

import com.tenpo.transactions.application.dto.AuthRequestDto;
import com.tenpo.transactions.application.dto.AuthResponseDto;
import com.tenpo.transactions.application.dto.RegisterRequestDto;
import com.tenpo.transactions.application.mapper.AccountDtoMapper;
import com.tenpo.transactions.application.port.in.AuthUseCase;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthUseCase useCase;
    private final AccountDtoMapper mapper;

    public AuthController(AuthUseCase useCase, AccountDtoMapper mapper) {
        this.useCase = useCase;
        this.mapper = mapper;
    }

    @PostMapping("signin")
    public ResponseEntity<AuthResponseDto> authenticate(@RequestBody @Valid AuthRequestDto request){
        AuthResult result = useCase.authenticate(request.getUsername(), request.getPassword());
        AuthResponseDto responseDto = mapper.toResponseDto(result);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @PostMapping("signup")
    public ResponseEntity<AuthResponseDto> register(@RequestBody @Valid RegisterRequestDto request){
        Account toCreate =  mapper.toDomain(request);
        AuthResult result = useCase.register(toCreate);
        AuthResponseDto responseDto = mapper.toResponseDto(result);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
}
