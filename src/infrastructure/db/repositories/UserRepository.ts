import { injectable } from 'tsyringe';
import { IUserRepository } from '@repositories/IUserRepository';
import { User, UserPayload } from '@models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersQueryOne, usersExecute } from '@utils/usersDatabase';
import config from '@config/index';

@injectable()
export class UserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const user = await usersQueryOne<User>('SELECT * FROM users WHERE username = ?', [username]);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await usersQueryOne<User>('SELECT * FROM users WHERE email = ?', [email]);
    return user || null;
  }

  async createUser(user: User): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    await usersExecute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [user.username, user.email, hashedPassword]);
    const created = await this.findByUsername(user.username);
    if (!created) throw new Error('User creation failed');
    return created;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  generateToken(user: UserPayload): string {
    const payload = { id: user.id, username: user.username, email: user.email };
    const secret = config.jwt.secret;
    const options = { expiresIn: config.jwt.expiresIn };
    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, config.jwt.secret) as UserPayload;
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await usersQueryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
    return user || null;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];
    if (user.username) { fields.push('username = ?'); values.push(user.username); }
    if (user.email) { fields.push('email = ?'); values.push(user.email); }
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      fields.push('password = ?');
      values.push(hashedPassword);
    }
    if (fields.length === 0) throw new Error('No fields to update');
    values.push(id);
    await usersExecute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    const updated = await this.getUserById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    await usersExecute('DELETE FROM users WHERE id = ?', [id]);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await usersQueryOne<User[]>('SELECT * FROM users', []);
    return users || [];
  }
}
