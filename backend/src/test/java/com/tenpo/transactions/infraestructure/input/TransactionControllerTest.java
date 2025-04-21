package com.tenpo.transactions.infraestructure.input;

import com.tenpo.transactions.domain.model.Transaction;
import com.tenpo.transactions.application.port.in.TransactionUseCase;
import com.tenpo.transactions.infrastructure.adapter.in.web.TransactionController;
import com.tenpo.transactions.application.dto.TransactionRequestDto;
import com.tenpo.transactions.application.dto.TransactionResponseDto;
import com.tenpo.transactions.infrastructure.adapter.out.db.mapper.TransactionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

//    @Autowired
//    private MockMvc mockMvc;
//
//    @Mock
//    private TransactionUseCase useCase;
//
//    @Mock
//    private TransactionMapper mapper;
//
//    private TransactionRequestDto requestDto;
//    private TransactionResponseDto responseDto;
//
//    @BeforeEach
//    void setUp() {
//        requestDto = TransactionRequestDto.builder()
//                .amount(10000)
//                .merchant("Para mercar")
//                .tenpistaName("test")
//                .build();
//
//        responseDto = TransactionResponseDto.builder()
//                .amount(10000)
//                .merchant("Para mercar")
//                .tenpistaName("test")
//                .transactionDate(LocalDateTime.now())
//                .accountId(1)
//                .build();
//    }
//
//    @Test
//    void testCreateTransaction() throws Exception {
//        when(useCase.save(any())).thenReturn(new Transaction());
//        when(mapper.toDto(any())).thenReturn(responseDto);
//
//        mockMvc.perform(post("/transaction")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"amount\":10000,\"merchant\":\"Para mercar\",\"tenpistaName\":\"test\",\"accountId\":1}"))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.merchant").value("Para mercar"))
//                .andExpect(jsonPath("$.amount").value(10000))
//                .andExpect(jsonPath("$.transactionDate").exists())
//                .andExpect(jsonPath("$.accountId").value(1));
//    }
}
