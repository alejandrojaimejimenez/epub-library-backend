import { Router } from 'express';
import { AuthController } from '../controllers';
import { authMiddleware } from '../middlewares';

const router = Router();
const authController = new AuthController();

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
