import request from 'supertest';
import express from 'express';
import AuthRoutes from '@routes/AuthRoutes';

// Nota: Se asume que la base de datos de usuarios de test ya está clonada antes de correr los tests (ver setupTestDb)
describe('Auth integration - /api/v1/auth', () => {
  let app: express.Express;
  let testUser: { username: string; email: string; password: string };

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', AuthRoutes);
  });

  describe('Flujo de registro y login', () => {
    beforeAll(async () => {
      // Registrar un usuario único para login
      const username = `testuser_${Date.now()}`;
      const email = `${username}@ejemplo.com`;
      const password = 'passwordseguro';
      testUser = { username, email, password };
      await request(app)
        .post('/api/v1/auth/register')
        .send({ username, email, password });
    });

    it('debe loguear correctamente con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: testUser.username, password: testUser.password });
      if (res.status !== 200) {
        // Mostrar el body para depuración
        // eslint-disable-next-line no-console
        console.error('Login válido falló:', res.body);
      }
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('debe fallar con credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: testUser.username, password: 'wrongpassword' });
      if (res.status !== 401) {
        // Mostrar el body para depuración
        // eslint-disable-next-line no-console
        console.error('Login incorrecto falló:', res.body);
      }
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /register', () => {
    it('debe registrar un usuario nuevo correctamente', async () => {
      const username = `nuevo${Date.now()}`;
      const email = `${username}@ejemplo.com`;
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username,
          email,
          password: 'passwordseguro',
        });
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('token');
    });

    it('debe fallar si el username ya existe', async () => {
      // Usa el username del usuario registrado en beforeAll
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: testUser.username,
          email: `otro${Date.now()}@ejemplo.com`,
          password: 'passwordseguro',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('debe fallar si el email ya existe', async () => {
      // Usa el email del usuario registrado en beforeAll
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: `otro${Date.now()}`,
          email: testUser.email,
          password: 'passwordseguro',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('debe fallar si los datos son inválidos', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: '',
          email: 'noesunemail',
          password: '123',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});
