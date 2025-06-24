import { Router } from 'express';
import { SearchController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();

// Rutas para las búsquedas - protegidas con autenticación
router.get('/', authMiddleware, SearchController.search);

export default router;
