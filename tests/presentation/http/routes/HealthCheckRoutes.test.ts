import request from 'supertest';
import express from 'express';
import HealthCheckRoutes from '@routes/HealthCheckRoutes';

describe('GET /api/v1/healthcheck', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    // Montar el router bajo /healthcheck para simular el montaje real
    app.use('/api/v1/healthcheck', HealthCheckRoutes);
  });

  it('debe responder con status 200 y el mensaje correcto', async () => {
    const res = await request(app).get('/api/v1/healthcheck/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('message', 'API funcionando correctamente');
  });
});
