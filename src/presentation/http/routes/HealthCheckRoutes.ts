import { Router } from 'express';
import { HealthCheckController } from '@controllers/HealthCheckController';

const router = Router();

router.get('/healthcheck', HealthCheckController.check);

export default router;
