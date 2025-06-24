import { Router } from 'express';
import { AuthorController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rutas para los autores - protegidas con autenticación
router.get('/', authMiddleware, AuthorController.getAllAuthors);
router.get('/:id', authMiddleware, AuthorController.getAuthorById);

export default router;
