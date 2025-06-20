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

// Variable para almacenar la conexión a la base de datos
let db: Database.Database | null = null;

/**
 * Obtiene una instancia de la base de datos
 */
export function getDatabase(): Database.Database {
  if (db) return db;

  try {
    // Configurar opciones de la base de datos
    const options: Database.Options = {
      readonly: false, // Modo lectura/escritura
      fileMustExist: true, // La base de datos debe existir
      timeout: 5000, // Tiempo de espera para adquirir un bloqueo (en ms)
    };

    db = new Database(dbPath, options);

    // Habilitar claves foráneas
    db.pragma('foreign_keys = ON');

    console.log(`Conexión a la base de datos establecida: ${dbPath}`);
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

/**
 * Cierra la conexión a la base de datos
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Conexión a la base de datos cerrada');
  }
}

/**
 * Ejecuta una consulta SQL y devuelve múltiples filas
 */
export function query<T>(sql: string, params: any[] = []): T[] {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

/**
 * Ejecuta una consulta SQL y devuelve una sola fila
 */
export function queryOne<T>(sql: string, params: any[] = []): T | undefined {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

/**
 * Ejecuta una consulta SQL que no devuelve resultados
 */
export function execute(sql: string, params: any[] = []): void {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  stmt.run(...params);
}

/**
 * Inicia una transacción
 */
export function beginTransaction(): void {
  const database = getDatabase();
  database.prepare('BEGIN TRANSACTION').run();
}

/**
 * Confirma una transacción
 */
export function commitTransaction(): void {
  const database = getDatabase();
  database.prepare('COMMIT').run();
}

/**
 * Revierte una transacción
 */
export function rollbackTransaction(): void {
  const database = getDatabase();
  database.prepare('ROLLBACK').run();
}

// Exportar el objeto de la base de datos para uso directo
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
