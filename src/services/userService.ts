import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User, UserPayload } from '../models/user';
import path from 'path';
import fs from 'fs';

export class UserService {
  private static instance: UserService;
  private db: any;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async initialize(): Promise<void> {
    // Asegurarse de que el directorio existe
    const dbDir = path.dirname(config.usersDbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`Directorio de base de datos de usuarios creado: ${dbDir}`);
    }

    // Abrir la conexión a la base de datos (se creará si no existe)
    this.db = await open({
      filename: config.usersDbPath,
      driver: sqlite3.Database
    });
    console.log(`Base de datos de usuarios conectada en: ${config.usersDbPath}`);

    // Crear la tabla de usuarios si no existe
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla de usuarios verificada/creada correctamente');
  }

  public async findByUsername(username: string): Promise<User | null> {
    return this.db.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  public async createUser(user: User): Promise<User> {
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const result = await this.db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [user.username, user.email, hashedPassword]
    );

    return {
      ...user,
      id: result.lastID,
      password: hashedPassword
    };
  }

  public async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
  
  public generateToken(user: UserPayload): string {
    const payload = { id: user.id, username: user.username, email: user.email };
    const secret = config.jwt.secret;
    const options = { expiresIn: config.jwt.expiresIn };
    
    return jwt.sign(payload, secret);
  }

  public verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, config.jwt.secret) as UserPayload;
    } catch (error) {
      return null;
    }
  }
}
