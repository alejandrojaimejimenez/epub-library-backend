import { Router } from 'express';
import { TagController } from '../controllers';

const router = Router();

// Rutas para las etiquetas
router.get('/', TagController.getAllTags);
router.get('/:id', TagController.getTagById);

export default router;
