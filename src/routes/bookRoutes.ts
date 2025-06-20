import { Router } from 'express';
import { BookController } from '../controllers';

const router = Router();

// Rutas para los libros
router.get('/', BookController.getAllBooks);
router.get('/search', BookController.searchBooks);
router.get('/:id/epub', BookController.getBookEpub); // Nueva ruta para obtener el EPUB
router.get('/:id', BookController.getBookById);
router.put('/:id/position', BookController.updateReadingPosition);

export default router;
