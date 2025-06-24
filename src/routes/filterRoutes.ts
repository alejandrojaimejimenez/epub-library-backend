import { Router } from 'express';
import { AuthorController, BookController, TagController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rutas para filtros por autor y etiqueta - protegidas con autenticación
router.get('/author/:name', authMiddleware, AuthorController.getBooksByAuthor);
router.get('/tag/:name', authMiddleware, TagController.getBooksByTag);

export default router;
