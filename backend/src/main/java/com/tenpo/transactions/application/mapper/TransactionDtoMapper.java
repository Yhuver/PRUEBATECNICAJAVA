package com.tenpo.transactions.application.mapper;

import com.tenpo.transactions.application.dto.TransactionRequestDto;
import com.tenpo.transactions.application.dto.TransactionResponseDto;
import com.tenpo.transactions.domain.model.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionDtoMapper {
    Transaction toDomain(TransactionRequestDto requestDto);
    TransactionResponseDto toResponseDto(Transaction domain);
}
