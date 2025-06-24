import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Cargar variables de entorno del archivo .env
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../data/db/metadata.db'),
  booksPath: process.env.BOOKS_PATH || path.resolve(__dirname, '../../data/books'),
  nodeEnv: process.env.NODE_ENV || 'development',
  usersDbPath: process.env.USERS_DB_PATH || path.resolve(__dirname, '../../data/db/users.db'),
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  }
};

export default config;
