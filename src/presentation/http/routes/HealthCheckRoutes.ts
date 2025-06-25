import { Router } from 'express';
import { HealthCheckController } from '@controllers/HealthCheckController';

const router = Router();

// El endpoint debe ser '/'
router.get('/', HealthCheckController.check);

export default router;
