package com.tenpo.transactions.infrastructure.input.controller;

import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.domain.port.input.TransactionUseCase;
import com.tenpo.transactions.infrastructure.input.dto.TransactionRequestDto;
import com.tenpo.transactions.infrastructure.input.dto.TransactionResponseDto;
import com.tenpo.transactions.infrastructure.input.mapper.TransactionMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;

import java.util.List;


@RestController
@AllArgsConstructor
@RequestMapping("api/transaction")
public class TransactionController {

    TransactionUseCase useCase;
    TransactionMapper mapper;

    @GetMapping
    public ResponseEntity<List<TransactionResponseDto>> getAll() {
        return new ResponseEntity<>(
                mapper.toDtoList(useCase.findAll()),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<TransactionResponseDto> create(@RequestBody @Valid TransactionRequestDto requestDto) {
        Transaction createdTransaction = useCase.save(mapper.toEntity(requestDto));
        return new ResponseEntity<>(mapper.toDto(createdTransaction), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        boolean deleted = useCase.delete(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<TransactionResponseDto> update(@PathVariable int id, @RequestBody @Valid TransactionRequestDto requestDto) {
        Transaction updated = useCase.update(id, mapper.toEntity(requestDto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }
}

