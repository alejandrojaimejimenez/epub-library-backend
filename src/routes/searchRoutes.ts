import { Router } from 'express';
import { SearchController } from '../controllers';

const router = Router();

// Rutas para las búsquedas
router.get('/', SearchController.search);

export default router;
