package com.tenpo.transactions.infrastructure.adapter.out.db.mapper;

import com.tenpo.transactions.domain.model.Account;
import com.tenpo.transactions.infrastructure.adapter.out.db.entity.AccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface AccountMapper {
    AccountEntity toEntity(Account domain);
    Account toDomain(AccountEntity entity);
}
