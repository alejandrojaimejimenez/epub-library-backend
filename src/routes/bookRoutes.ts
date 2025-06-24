import { Router } from 'express';
import { BookController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rutas para los libros - protegidas con autenticación
router.get('/', authMiddleware, BookController.getAllBooks);
router.get('/search', authMiddleware, BookController.searchBooks);
router.get('/:id/epub', authMiddleware, BookController.getBookEpub); // Ruta para obtener el EPUB
router.get('/:id/position', authMiddleware, BookController.getReadingPosition); // Ruta para obtener la posición de lectura
router.get('/:id', authMiddleware, BookController.getBookById);
router.put('/:id/position', authMiddleware, BookController.updateReadingPosition); // Ruta para actualizar la posición de lectura

export default router;
