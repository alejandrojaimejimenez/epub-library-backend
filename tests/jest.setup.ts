// tests/jest.setup.ts
import fs from 'fs';
import path from 'path';

// Clona la base de datos de usuarios antes de cargar cualquier módulo
const src = path.resolve(__dirname, '../data/users.db');
const dest = path.resolve(__dirname, '../data/users.test.db');
if (fs.existsSync(dest)) fs.unlinkSync(dest);
fs.copyFileSync(src, dest);
process.env.USERS_DB_PATH = dest;

import 'reflect-metadata';
import { setupTestDb, cleanupTestDb } from './setupTestDb';

beforeAll(() => {
  setupTestDb();
});

afterAll(() => {
  cleanupTestDb();
});
