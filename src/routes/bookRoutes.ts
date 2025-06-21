import { Router } from 'express';
import { BookController } from '../controllers';

const router = Router();

// Rutas para los libros
router.get('/', BookController.getAllBooks);
router.get('/search', BookController.searchBooks);
router.get('/:id/epub', BookController.getBookEpub); // Ruta para obtener el EPUB
router.get('/:id/position', BookController.getReadingPosition); // Ruta para obtener la posición de lectura
router.get('/:id', BookController.getBookById);
router.put('/:id/position', BookController.updateReadingPosition); // Ruta para actualizar la posición de lectura

export default router;
