package com.tenpo.transactions.application.mapper;

import com.tenpo.transactions.application.dto.AuthResponseDto;
import com.tenpo.transactions.application.dto.RegisterRequestDto;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountDtoMapper {
    AuthResponseDto toResponseDto(AuthResult result);
    Account toDomain(RegisterRequestDto dto);
}
