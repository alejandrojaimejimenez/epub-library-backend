import 'module-alias/register';
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

// Middleware de errores
app.use(ErrorMiddleware);

export default app;
