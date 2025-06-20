import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno del archivo .env
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../data/db/metadata.db'),
  booksPath: process.env.BOOKS_PATH || path.resolve(__dirname, '../../data/books'),
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
