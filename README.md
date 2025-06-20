# EPUB Library Backend

Backend para aplicación de biblioteca EPUB con soporte para la base de datos de Calibre.

## Características

- API REST completa para acceder a una biblioteca de Calibre
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

### Libros

- `GET /api/books` - Obtener todos los libros
- `GET /api/books/:id` - Obtener un libro por ID
- `GET /api/books/search?q=:query` - Buscar libros por título
- `PUT /api/books/:id/position` - Actualizar posición de lectura

### Autores

- `GET /api/authors` - Obtener todos los autores
- `GET /api/authors/:id` - Obtener un autor por ID
- `GET /api/books/author/:name` - Obtener libros por autor

### Etiquetas

- `GET /api/tags` - Obtener todas las etiquetas
- `GET /api/tags/:id` - Obtener una etiqueta por ID
- `GET /api/books/tag/:name` - Obtener libros por etiqueta

### Búsqueda

- `GET /api/search?q=:query&author=:authorId&tag=:tagId&series=:seriesId` - Búsqueda avanzada

### Archivos

- `GET /api/file/:path` - Obtener un archivo (EPUB, portada, etc.)
- `GET /static/books/:path` - Acceso directo a archivos estáticos

## Licencia

Este proyecto está licenciado bajo la licencia ISC.
