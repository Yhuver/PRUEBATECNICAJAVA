package com.tenpo.transactions.application.mapper;

import com.tenpo.transactions.application.dto.AuthResponseDto;
import com.tenpo.transactions.application.dto.RefreshTokenDto;
import com.tenpo.transactions.application.dto.RegisterRequestDto;
import com.tenpo.transactions.application.result.AuthResult;
import com.tenpo.transactions.domain.model.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountDtoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "active", constant = "true")
    Account toAuthDomain(RegisterRequestDto dto);

    AuthResponseDto toAuthResponseDto(AuthResult result);
    RefreshTokenDto toRefreshTokenResponseDto(AuthResult result);
}
