import { Router } from 'express';
import { AuthorController, BookController, TagController } from '../controllers';

const router = Router();

// Rutas para filtros por autor y etiqueta
router.get('/author/:name', AuthorController.getBooksByAuthor);
router.get('/tag/:name', TagController.getBooksByTag);

export default router;
