import Database from 'better-sqlite3';
import config from '../config';
import path from 'path';
import fs from 'fs';

// Verificar que la base de datos existe
const dbPath = path.resolve(config.dbPath);
if (!fs.existsSync(dbPath)) {
  console.error(`Error: Base de datos no encontrada en ${dbPath}`);
  process.exit(1);
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) return db;
  try {
    const options: Database.Options = {
      readonly: false,
      fileMustExist: true,
      timeout: 5000,
    };
    db = new Database(dbPath, options);
    db.pragma('foreign_keys = ON');
    console.log(`Conexión a la base de datos establecida: ${dbPath}`);
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Conexión a la base de datos cerrada');
  }
}

export function query<T>(sql: string, params: any[] = []): T[] {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T>(sql: string, params: any[] = []): T | undefined {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function execute(sql: string, params: any[] = []): any {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(...params);
}

export function beginTransaction(): void {
  const database = getDatabase();
  database.prepare('BEGIN TRANSACTION').run();
}

export function commitTransaction(): void {
  const database = getDatabase();
  database.prepare('COMMIT').run();
}

export function rollbackTransaction(): void {
  const database = getDatabase();
  database.prepare('ROLLBACK').run();
}

export default {
  getDatabase,
  closeDatabase,
  query,
  queryOne,
  execute,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
};
