import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '@controllers/UserController';
import { catchAsync } from '@utils/catchAsync';
import { AuthMiddleware } from '@auth/AuthMiddleware';

const router = Router();
const controller = container.resolve(UserController);

router.use(AuthMiddleware);

router.post('/', catchAsync(controller.createUser.bind(controller)));
router.get('/', catchAsync(controller.getAllUsers.bind(controller)));
router.get('/:id', catchAsync(controller.getUserById.bind(controller)));
router.put('/:id', catchAsync(controller.updateUser.bind(controller)));
router.delete('/:id', catchAsync(controller.deleteUser.bind(controller)));

export default router;
