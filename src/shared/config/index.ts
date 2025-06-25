import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../../data/db/metadata.db'),
  booksPath: process.env.BOOKS_PATH || path.resolve(__dirname, '../../../data/books'),
  nodeEnv: process.env.NODE_ENV || 'development',
  usersDbPath: process.env.USERS_DB_PATH || path.resolve(__dirname, '../../../data/users.db'), // <-- corregido aquí
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_secreto_super_seguro',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  }
};

export default config;
