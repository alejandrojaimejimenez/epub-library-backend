import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';
import path from 'path';
import { UserService } from './services';

// Inicializar el servicio de usuarios
(async () => {
  const userService = UserService.getInstance();
  await userService.initialize();
  console.log('Servicio de usuarios inicializado correctamente');
})();

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio de libros
app.use('/static/books', express.static(config.booksPath));

// Configurar rutas API
app.use('/api', routes);

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EPUB Library Backend API',
    version: '1.0.0'
  });
});

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware para manejar errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${config.nodeEnv}`);
  console.log(`Base de datos: ${config.dbPath}`);
  console.log(`Directorio de libros: ${config.booksPath}`);
});

export default app;
