package com.tenpo.transactions.infrastructure.input.mapper;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.infrastructure.input.dto.TransactionRequestDto;
import com.tenpo.transactions.infrastructure.input.dto.TransactionResponseDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    Transaction toEntity(TransactionRequestDto dto);

    TransactionResponseDto toDto(Transaction transaction);

    List<TransactionResponseDto> toDtoList(List<Transaction> transactions);
}