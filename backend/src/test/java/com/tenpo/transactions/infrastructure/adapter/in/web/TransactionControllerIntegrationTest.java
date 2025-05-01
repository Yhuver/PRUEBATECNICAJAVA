package com.tenpo.transactions.infrastructure.adapter.in.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenpo.transactions.application.dto.TransactionRequestDto;
import com.tenpo.transactions.application.dto.TransactionResponseDto;
import com.tenpo.transactions.application.mapper.TransactionDtoMapper;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import com.tenpo.transactions.domain.model.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TransactionControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @MockitoBean
    private TransactionUseCase transactionUseCase;
    
    @MockitoBean
    private TransactionDtoMapper mapper;

    private Transaction sampleTransaction;
    private TransactionResponseDto sampleResponseDto;
    private TransactionRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
        
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
    @WithMockUser
    void getAllTransaction_ShouldReturnAllTransactions() throws Exception {
        List<Transaction> transactions = List.of(sampleTransaction);
        
        when(transactionUseCase.findAll()).thenReturn(transactions);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        mockMvc.perform(get("/api/transaction"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].amount").value(100))
                .andExpect(jsonPath("$[0].merchant").value("Tienda XYZ"));
    }

    @Test
    @WithMockUser
    void createTransaction_ShouldCreateAndReturnTransaction() throws Exception {
        when(mapper.toDomain(any(TransactionRequestDto.class))).thenReturn(sampleTransaction);
        when(transactionUseCase.save(any(Transaction.class))).thenReturn(sampleTransaction);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        mockMvc.perform(post("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(100))
                .andExpect(jsonPath("$.merchant").value("Tienda XYZ"));
    }

    @Test
    @WithMockUser
    void deleteTransaction_WhenSuccessful_ShouldReturnNoContent() throws Exception {
        when(transactionUseCase.delete(anyInt())).thenReturn(true);

        mockMvc.perform(delete("/api/transaction/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteTransaction_WhenUnsuccessful_ShouldReturnConflict() throws Exception {
        when(transactionUseCase.delete(anyInt())).thenReturn(false);

        mockMvc.perform(delete("/api/transaction/1"))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser
    void updateTransaction_ShouldUpdateAndReturnTransaction() throws Exception {
        when(mapper.toDomain(any(TransactionRequestDto.class))).thenReturn(sampleTransaction);
        when(transactionUseCase.update(anyInt(), any(Transaction.class))).thenReturn(sampleTransaction);
        when(mapper.toResponseDto(any(Transaction.class))).thenReturn(sampleResponseDto);

        mockMvc.perform(put("/api/transaction/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(100))
                .andExpect(jsonPath("$.merchant").value("Tienda XYZ"));
    }
    
    @Test
    @WithMockUser
    void invalidTransaction_ShouldReturnBadRequest() throws Exception {
        TransactionRequestDto invalidRequestDto = new TransactionRequestDto();
        invalidRequestDto.setAmount(-100);
        invalidRequestDto.setMerchant("");
        
        mockMvc.perform(post("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequestDto)))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void unauthenticatedRequest_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/transaction"))
                .andExpect(status().isUnauthorized());
    }
}