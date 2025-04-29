
# Prueba técnica transacciones [Frontend]

Este es un proyecto de prueba técnica que permite gestionar transacciones. La aplicación incluye un CRUD completo para crear, leer, actualizar y eliminar transacciones. Además, muestra una tabla interactiva para visualizar las transacciones, con opciones de paginación y filtrado.
El proyecto está estructurado siguiendo el enfoque de Atomic Design, lo que permite crear componentes modulares y reutilizables, organizados de acuerdo con su nivel de complejidad (átomos, moléculas, organismos).


## Estructura del Proyecto

```
├── assets/                      # Archivos estáticos como íconos y imágenes
│   └── favicon.svg
├── components/                  # Componentes reutilizables organizados por tipo
│   ├── atoms/                   # Componentes atómicos, como botones o inputs
│   ├── molecules/               # Componentes intermedios, como formularios o tablas
│   ├── organisms/               # Componentes más complejos que combinan los anteriores
│   ├── pages/                   # Páginas de la aplicación
│   ├── templates/               # Plantillas reutilizables
│   └── ui/                      # Componentes de UI como diálogos, botones, tablas
├── constants/                   # Constantes, como rutas o mensajes
├── contexts/                    # Contextos para manejo de estados globales
├── hooks/                       # Hooks personalizados
├── interfaces/                  # Interfaces de TypeScript para tipado fuerte
├── lib/                         # Funciones utilitarias
├── providers/                   # Proveedores de contexto, como el tema
├── schemas/                     # Esquemas de validación de datos
├── services/                    # Lógica de servicios, como llamadas a APIs
├── App.css                      # Estilos globales
├── App.tsx                      # Componente principal de la aplicación
├── index.css                    # Estilos globales adicionales
├── main.tsx                     # Punto de entrada de la aplicación
├── vite-env.d.ts                # Tipado de variables de entorno de Vite
├── package.json                 # Dependencias del proyecto
├── vite.config.ts               # Configuración de Vite
└── .gitignore                   # Archivos ignorados por Git
```

---

## Tecnologías

- **Vite**: Bundler y servidor de desarrollo rápido.
- **React**: Librería para crear interfaces de usuario.
- **React Hook Form**: Librería para crear y gestionar formularios de manera eficiente.
- **Zod**: Librería para validaciones de formularios y datos.
- **React Router**: Para gestionar la navegación entre páginas en la aplicación.
- **ShadCN UI**: Conjunto de componentes reutilizables y accesibles para construir interfaces.
- **TailwindCSS**: Framework CSS basado en utilidades para un diseño rápido y personalizable.

