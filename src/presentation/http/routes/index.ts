import express from 'express';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import BookRoutes from './BookRoutes';
import AuthorRoutes from './AuthorRoutes';
import TagRoutes from './TagRoutes';
import SearchRoutes from './SearchRoutes';
import HealthCheckRoutes from './HealthCheckRoutes';
import { AuthMiddleware } from '@auth/AuthMiddleware';

const router = express.Router();

// Rutas públicas
router.use('/auth', AuthRoutes);
router.use('/healthcheck', HealthCheckRoutes);

// Proteger todas las rutas salvo login/register
router.use('/users', AuthMiddleware, UserRoutes);
router.use('/books', AuthMiddleware, BookRoutes);
router.use('/authors', AuthMiddleware, AuthorRoutes);
router.use('/tags', AuthMiddleware, TagRoutes);
router.use('/search', AuthMiddleware, SearchRoutes);

export default router;
