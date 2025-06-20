import { Router } from 'express';
import { AuthorController } from '../controllers';

const router = Router();

// Rutas para los autores
router.get('/', AuthorController.getAllAuthors);
router.get('/:id', AuthorController.getAuthorById);

export default router;
