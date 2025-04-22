
# Prueba Tecnica

Este proyecto está configurado con Docker y Docker Compose para levantar dos servicios: un contenedor de base de datos PostgreSQL y un contenedor frontend.

## Estructura del Proyecto

```
my-project/
│
├── docker-compose.yml   # Configuración de los servicios
├── .env                 # Variables de entorno para la base de datos
├── frontend/            # Carpeta con el código fuente del frontend
│   ├── Dockerfile       # Dockerfile para construir la imagen del frontend
│   └── ...              # Archivos y carpetas del frontend
```

## Requisitos

Asegúrate de tener las siguientes herramientas instaladas:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para configurar PostgreSQL. El archivo `.env` debe contener las siguientes variables:

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
```

Reemplaza `myuser`, `mypassword` y `mydatabase` con los valores que desees.

## Configuración

### 1. Clona el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

### 2. Crea las Imágenes de Docker

Para construir y levantar los contenedores, usa el siguiente comando:

```bash
docker-compose up --build -d
```

Este comando construirá las imágenes necesarias (si no están construidas aún) y levantará los servicios definidos en el archivo `docker-compose.yml`.

### 3. Accede a los Servicios

- **Frontend**: El frontend estará disponible en `http://localhost:5173`.
- **PostgreSQL**: La base de datos PostgreSQL estará disponible en el puerto `5432` de tu máquina local.

Puedes conectarte a PostgreSQL desde cualquier cliente de bases de datos utilizando las credenciales definidas en el archivo `.env`:

- **Host**: `localhost`
- **Puerto**: `5432`
- **Usuario**: `<POSTGRES_USER>`
- **Contraseña**: `<POSTGRES_PASSWORD>`
- **Base de datos**: `<POSTGRES_DB>`

## Parar los Contenedores

Para detener y eliminar los contenedores, ejecuta:

```bash
docker-compose down
```

## Notas Adicionales

- Asegúrate de tener configurado correctamente el archivo `.env` para evitar errores con la base de datos.
- Puedes personalizar los puertos y la configuración de los servicios en el archivo `docker-compose.yml` según las necesidades de tu proyecto.

