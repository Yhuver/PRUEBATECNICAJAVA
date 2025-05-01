package com.tenpo.transactions.infrastructure.exception;

import com.tenpo.transactions.domain.exception.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler exceptionHandler;

    @Mock
    private WebRequest webRequest;

    @Mock
    private MethodArgumentNotValidException methodArgumentNotValidException;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        // Configuración común para pruebas
    }

    @Test
    void handleTransactionNotFoundException_ShouldReturnNotFoundStatus() {
        
        TransactionNotFoundException exception = new TransactionNotFoundException(1);
        
        
        ResponseEntity<Object> response = exceptionHandler.handleTransactionNotFoundException(exception, webRequest);
        
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.NOT_FOUND.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleTransactionValidationException_ShouldReturnBadRequestStatus() {
        
        TransactionValidationException exception = new TransactionValidationException();
        
        
        ResponseEntity<Object> response = exceptionHandler.handleTransactionValidationException(exception, webRequest);
        
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleAccountNotFoundException_ShouldReturnNotFoundStatus() {
        
        AccountNotFoundException exception = new AccountNotFoundException("");
        
        
        ResponseEntity<Object> response = exceptionHandler.handleAccountNotFoundException(exception, webRequest);
        
        
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.NOT_FOUND.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleTransactionLimitExceededException_ShouldReturnConflictStatus() {
        
        TransactionLimitExceededException exception = new TransactionLimitExceededException();
        
        
        ResponseEntity<Object> response = exceptionHandler.handleTransactionLimitExceededException(exception, webRequest);
        
        
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.CONFLICT.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleInvalidTransactionException_ShouldReturnBadRequestStatus() {
        
        InvalidTransactionAmountException exception = new InvalidTransactionAmountException();
        
        
        ResponseEntity<Object> response = exceptionHandler.handleInvalidTransactionException(exception, webRequest);
        
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.BAD_REQUEST.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleAccountAlreadyExistsException_ShouldReturnConflictStatus() {
        
        AccountAlreadyExistsException exception = new AccountAlreadyExistsException();
        
        
        ResponseEntity<Object> response = exceptionHandler.handleAccountAlreadyExistsException(exception, webRequest);
        
        
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.CONFLICT.value(), errorResponse.getStatus());
        assertEquals(exception.getErrorCode(), errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }

    @Test
    void handleExpiredAccessToken_ShouldReturnUnauthorizedStatus() {
        
        ExpiredAccessTokenException exception = new ExpiredAccessTokenException();
        
        
        ResponseEntity<String> response = exceptionHandler.handleExpiredAccessToken(exception);
        
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Token de acceso expirado", response.getBody());
    }

    @Test
    void handleInvalidAccessToken_ShouldReturnUnauthorizedStatus() {
        
        InvalidAccessTokenException exception = new InvalidAccessTokenException();
        
        
        ResponseEntity<String> response = exceptionHandler.handleInvalidAccessToken(exception);
        
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Token de acceso no válido", response.getBody());
    }

    @Test
    void handleGlobalException_ShouldReturnInternalServerError() {
        
        Exception exception = new RuntimeException("Unexpected error");
        
        
        ResponseEntity<Object> response = exceptionHandler.handleGlobalException(exception, webRequest);
        
        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ErrorResponse errorResponse = (ErrorResponse) response.getBody();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), errorResponse.getStatus());
        assertEquals("INTERNAL_SERVER_ERROR", errorResponse.getErrorCode());
        assertNotNull(errorResponse.getTimestamp());
    }
}