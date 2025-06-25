require('module-alias/register');
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import config from '@config/index';
import routes from '@routes/index';
import { ErrorMiddleware } from '@middlewares/ErrorMiddleware';
import path from 'path';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (si aplica)
app.use('/static/books', express.static(config.booksPath));

// Rutas API versionadas
app.use('/api/v1', routes);

// Ruta de salud
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'EPUB Library Backend API',
    version: '1.0.0'
  });
});

// Middleware de errores
app.use(ErrorMiddleware);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${config.nodeEnv}`);
  console.log(`Base de datos: ${config.dbPath}`);
  console.log(`Directorio de libros: ${config.booksPath}`);
});

export default app;
