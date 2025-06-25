import { Router } from 'express';
import { BookController } from '@controllers/BookController';
import { catchAsync } from '@utils/catchAsync';
import { AuthMiddleware } from '@auth/AuthMiddleware';

const router = Router();
const controller = new BookController();

router.use(AuthMiddleware);

// Rutas RESTful para libros
router.get('/', catchAsync(controller.getAll.bind(controller)));
router.get('/search', catchAsync(controller.search.bind(controller)));
router.get('/:id', catchAsync(controller.getById.bind(controller)));
router.get('/:id/epub', catchAsync(controller.downloadEpub.bind(controller)));

export default router;
