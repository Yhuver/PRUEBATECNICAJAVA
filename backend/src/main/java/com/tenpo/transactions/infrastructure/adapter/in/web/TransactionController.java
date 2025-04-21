package com.tenpo.transactions.infrastructure.adapter.in.web;

import com.tenpo.transactions.application.mapper.TransactionDtoMapper;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import com.tenpo.transactions.application.dto.TransactionRequestDto;
import com.tenpo.transactions.application.dto.TransactionResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/transaction")
public class TransactionController {

    private final TransactionUseCase useCase;
    private final TransactionDtoMapper mapper;

    public TransactionController(TransactionUseCase useCase, TransactionDtoMapper mapper) {
        this.useCase = useCase;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponseDto>> getAllTransaction() {
        List<Transaction> transactions = useCase.findAll();
        List<TransactionResponseDto> responseDtos = transactions.stream()
                .map(mapper::toResponseDto)
                .toList();

        return new ResponseEntity<>(
                responseDtos,
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @RequestBody @Valid TransactionRequestDto requestDto
    ) {
        Transaction createdTransaction = useCase.save(mapper.toDomain(requestDto));
        return new ResponseEntity<>(mapper.toResponseDto(createdTransaction), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable int id) {
        boolean deleted = useCase.delete(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<TransactionResponseDto> updateTransaction(
            @PathVariable int id,
            @RequestBody @Valid TransactionRequestDto requestDto
    ) {
        Transaction updated = useCase.update(id, mapper.toDomain(requestDto));
        return ResponseEntity.ok(mapper.toResponseDto(updated));
    }
}

