package com.tenpo.transactions.infrastructure.input.mapper;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.input.dto.AccountRequestDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toEntity (AccountRequestDto dto);
}
