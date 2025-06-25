import { Router } from 'express';
import { AuthController } from '@controllers/AuthController';
import { AuthMiddleware } from '@auth/AuthMiddleware';
import { catchAsync } from '@utils/catchAsync';

const router = Router();
const controller = new AuthController();

router.post('/register', catchAsync(controller.register.bind(controller)));
router.post('/login', catchAsync(controller.login.bind(controller)));
router.get('/profile', AuthMiddleware, catchAsync(controller.getProfile.bind(controller)));

export default router;
