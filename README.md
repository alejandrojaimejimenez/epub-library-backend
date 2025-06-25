# EPUB Library Backend

Backend para aplicación de biblioteca EPUB con soporte para la base de datos de Calibre.

## Características

- API REST completa para acceder a una biblioteca de Calibre
- Autenticación de usuarios con JWT
- Soporte para lectura/escritura de archivos EPUB
- Gestión de metadatos de libros
- Gestión de portadas
- Actualización de posición de lectura
- Búsqueda y filtrado por autor/tags
- Servicio de archivos estáticos (EPUBs, portadas, etc.)

## Tecnologías utilizadas

- Node.js con TypeScript
- Express.js para la API REST
- SQLite3 (mejor-sqlite3) para la base de datos
- Multer para manejo de archivos
- CORS para permitir peticiones desde la app web
- Docker para containerización

## Estructura de directorios

```
/
├── src/                  # Código fuente
│   ├── config/           # Configuraciones
│   ├── controllers/      # Controladores de la API
│   ├── middlewares/      # Middlewares
│   ├── models/           # Modelos y tipos
│   ├── routes/           # Rutas de la API
│   ├── services/         # Servicios para lógica de negocio
│   ├── utils/            # Utilidades
│   └── index.ts          # Punto de entrada
├── data/                 # Datos (montados como volumen en Docker)
│   ├── db/               # Base de datos SQLite de Calibre
│   └── books/            # Libros EPUB y portadas
├── dist/                 # Código compilado (generado)
├── .env                  # Variables de entorno
├── Dockerfile            # Configuración para Docker
├── docker-compose.yml    # Configuración para Docker Compose
└── package.json          # Dependencias y scripts
```

## Requisitos previos

- Node.js 18 o superior
- Una biblioteca de Calibre existente

## Instalación

1. Clonar el repositorio:
   ```
   git clone <url-del-repositorio>
   cd epub-library-backend
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Configurar las variables de entorno:
   ```
   cp .env.example .env
   ```
   Editar el archivo `.env` con la configuración deseada.

4. Construir la aplicación:
   ```
   npm run build
   ```

5. Iniciar el servidor:
   ```
   npm start
   ```

## Uso con Docker

1. Construir y ejecutar con Docker Compose:
   ```
   docker-compose up -d
   ```

2. El servidor estará disponible en `http://localhost:3000`

## Endpoints de la API

> Todas las rutas están versionadas bajo `/api/v1/` y, salvo `/auth/login` y `/auth/register`, requieren autenticación JWT (`Authorization: Bearer <token>`).

### Healthcheck
- `GET /api/v1/healthcheck` — Estado de salud de la API (pública)

### Autenticación
- `POST /api/v1/auth/register` — Registrar un nuevo usuario
- `POST /api/v1/auth/login` — Iniciar sesión
- `GET /api/v1/auth/profile` — Perfil del usuario autenticado (requiere JWT)

### Usuarios
- `POST /api/v1/users` — Crear usuario *(requiere JWT)*
- `GET /api/v1/users` — Listar todos los usuarios *(requiere JWT)*
- `GET /api/v1/users/:id` — Obtener usuario por ID *(requiere JWT)*
- `PUT /api/v1/users/:id` — Actualizar usuario por ID *(requiere JWT)*
- `DELETE /api/v1/users/:id` — Eliminar usuario por ID *(requiere JWT)*

### Libros
- `GET /api/v1/books` — Listar todos los libros *(requiere JWT)*
- `GET /api/v1/books/search` — Buscar libros *(requiere JWT)*
- `GET /api/v1/books/:id` — Obtener libro por ID *(requiere JWT)*

### Autores *(en desarrollo)*
- `GET /api/v1/authors` — Listar autores *(requiere JWT)*
- `GET /api/v1/authors/:id` — Obtener autor por ID *(requiere JWT)*

### Etiquetas *(en desarrollo)*
- `GET /api/v1/tags` — Listar etiquetas *(requiere JWT)*
- `GET /api/v1/tags/:id` — Obtener etiqueta por ID *(requiere JWT)*

### Búsqueda *(en desarrollo)*
- `GET /api/v1/search` — Búsqueda avanzada *(requiere JWT)*

---

> **Nota:** Algunos endpoints heredados o no implementados pueden aparecer en la documentación anterior, pero solo los listados aquí están activos y alineados con la arquitectura Clean Architecture + TypeScript.

## Licencia

Este proyecto está licenciado bajo la licencia ISC.
