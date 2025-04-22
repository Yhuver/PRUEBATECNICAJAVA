package com.tenpo.transactions.infraestructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenpo.transactions.application.dto.TransactionRequestDto;
import com.tenpo.transactions.application.dto.TransactionResponseDto;
import com.tenpo.transactions.application.mapper.TransactionDtoMapper;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.infrastructure.adapter.in.web.TransactionController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransactionUseCase transactionUseCase;

    @Mock
    private TransactionDtoMapper mapper;

    @InjectMocks
    private TransactionController transactionController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private Transaction sampleTransaction;
    private TransactionResponseDto sampleResponseDto;
    private TransactionRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController).build();
        objectMapper = new ObjectMapper();
        
        // Configurar datos de prueba
        sampleTransaction = new Transaction();
        sampleTransaction.setId(1);
        sampleTransaction.setAmount(100);
        sampleTransaction.setMerchant("Tienda XYZ");
        
        sampleResponseDto = new TransactionResponseDto();
        sampleResponseDto.setId(1);
        sampleResponseDto.setAmount(100);
        sampleResponseDto.setMerchant("Tienda XYZ");
        
        sampleRequestDto = new TransactionRequestDto();
        sampleRequestDto.setAmount(100);
        sampleRequestDto.setMerchant("Tienda XYZ");
    }

    @Test
    void getAllTransaction_ShouldReturnAllTransactions() throws Exception {
        // Arrange
        List<Transaction> transactions = List.of(sampleTransaction);
        List<TransactionResponseDto> responseDtos = List.of(sampleResponseDto);
        
        when(transactionUseCase.findAll()).thenReturn(transactions);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        // Act & Assert
        mockMvc.perform(get("/api/transaction"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].amount").value(100))
                .andExpect(jsonPath("$[0].merchant").value("Tienda XYZ"));
    }

    @Test
    void createTransaction_ShouldCreateAndReturnTransaction() throws Exception {
        // Arrange
        when(mapper.toDomain(any(TransactionRequestDto.class))).thenReturn(sampleTransaction);
        when(transactionUseCase.save(any(Transaction.class))).thenReturn(sampleTransaction);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        // Act & Assert
        mockMvc.perform(post("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(100))
                .andExpect(jsonPath("$.merchant").value("Tienda XYZ"));
    }

    @Test
    void deleteTransaction_WhenSuccessful_ShouldReturnNoContent() throws Exception {
        // Arrange
        when(transactionUseCase.delete(anyInt())).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/transaction/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTransaction_WhenUnsuccessful_ShouldReturnConflict() throws Exception {
        // Arrange
        when(transactionUseCase.delete(anyInt())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/transaction/1"))
                .andExpect(status().isConflict());
    }

    @Test
    void updateTransaction_ShouldUpdateAndReturnTransaction() throws Exception {
        // Arrange
        when(mapper.toDomain(any(TransactionRequestDto.class))).thenReturn(sampleTransaction);
        when(transactionUseCase.update(anyInt(), any(Transaction.class))).thenReturn(sampleTransaction);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        // Act & Assert
        mockMvc.perform(put("/api/transaction/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(100))
                .andExpect(jsonPath("$.merchant").value("Tienda XYZ"));
    }
}