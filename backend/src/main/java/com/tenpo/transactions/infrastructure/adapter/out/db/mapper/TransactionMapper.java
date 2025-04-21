package com.tenpo.transactions.infrastructure.adapter.out.db.mapper;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.TransactionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    Transaction toDomain(TransactionEntity entity);
    TransactionEntity toEntity(Transaction domain);
}