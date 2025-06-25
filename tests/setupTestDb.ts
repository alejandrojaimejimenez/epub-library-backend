// tests/setupTestDb.ts
// Script para clonar la base de datos real a una temporal antes de los tests

import fs from 'fs';
import path from 'path';

// Rutas correctas según estructura real
const dbDir = path.resolve(__dirname, '../../data/db');
const realDb = path.join(dbDir, 'metadata.db');
const testDb = path.join(dbDir, 'metadata.test.db');

const usersDir = path.resolve(__dirname, '../../data');
const realUsersDb = path.join(usersDir, 'users.db');
const testUsersDb = path.join(usersDir, 'users.test.db');

export function setupTestDb() {
  // metadata
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
  if (fs.existsSync(realDb)) fs.copyFileSync(realDb, testDb);
  // users
  if (fs.existsSync(testUsersDb)) fs.unlinkSync(testUsersDb);
  if (fs.existsSync(realUsersDb)) fs.copyFileSync(realUsersDb, testUsersDb);
}

export function cleanupTestDb() {
  if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
  if (fs.existsSync(testUsersDb)) fs.unlinkSync(testUsersDb);
}
