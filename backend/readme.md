# Proyecto de Gestión de Transacciones

Este proyecto es una aplicación para gestionar transacciones y autenticación de usuarios. Está desarrollado en Java utilizando el patrón de arquitectura hexagonal y Spring Boot.

## Estructura del Proyecto

La estructura del proyecto sigue el modelo de capas y se organiza de la siguiente manera:

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── tenpo
│   │           └── transactions
│   │               ├── application        # Lógica de aplicación y casos de uso
│   │               ├── domain             # Lógica de dominio y excepciones
│   │               ├── infrastructure     # Adaptadores y detalles de infraestructura
│   │               ├── security           # Seguridad y manejo de tokens
│   │               └── TransactionsApplication.java
│   └── resources
│       └── application.yaml               # Configuración de la app
└── test
└── java
└── com
└── tenpo
└── transactions
└── integrationTests   # Pruebas de integración
└── unitTests          # Pruebas unitarias
```

## Endpoints

- **Autenticación**
    - POST /api/auth/signup --> Registra un nuevo usuario.
    - POST /api/auth/signin --> Inicia sesión y genera un token JWT.
    - POST /api/auth/refresh --> Renueva el token JWT.
    - POST /api/auth/logout --> 
    - GET /api/auth/check-session -->
- **Transacciones**
    - GET /api/transaction/{id} --> Obtiene detalles de una transacción por ID.
    - PUT /api/transaction/{id} --> Edita una transaction
    - DELETE /api/transaction/{id} -->
    - GET /api/transaction/ 
    - POST /transactions --> Crea una nueva transacción.
