import { Router } from 'express';
import { TagController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rutas para las etiquetas - protegidas con autenticación
router.get('/', authMiddleware, TagController.getAllTags);
router.get('/:id', authMiddleware, TagController.getTagById);

export default router;
