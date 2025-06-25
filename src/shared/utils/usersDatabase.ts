import Database from 'better-sqlite3';
import config from '../config';
import path from 'path';
import fs from 'fs';

// Verificar que la base de datos de usuarios existe
const usersDbPath = path.resolve(config.usersDbPath);
if (!fs.existsSync(usersDbPath)) {
  console.error(`Error: Base de datos de usuarios no encontrada en ${usersDbPath}`);
  process.exit(1);
}

let db: Database.Database | null = null;

export function getUsersDatabase(): Database.Database {
  if (db) return db;
  try {
    const options: Database.Options = {
      readonly: false,
      fileMustExist: true,
      timeout: 5000,
    };
    db = new Database(usersDbPath, options);
    db.pragma('foreign_keys = ON');
    console.log(`Conexión a la base de datos de usuarios establecida: ${usersDbPath}`);
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos de usuarios:', error);
    process.exit(1);
  }
}

export function closeUsersDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Conexión a la base de datos de usuarios cerrada');
  }
}

export function usersQuery<T>(sql: string, params: any[] = []): T[] {
  const database = getUsersDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

export function usersQueryOne<T>(sql: string, params: any[] = []): T | undefined {
  const database = getUsersDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function usersExecute(sql: string, params: any[] = []): any {
  const database = getUsersDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(...params);
}

export default {
  getUsersDatabase,
  closeUsersDatabase,
  usersQuery,
  usersQueryOne,
  usersExecute,
};
