import { User } from '@models/User';
import { UserPayload } from '@models/User';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
  generateToken(user: UserPayload): string;
  verifyToken(token: string): UserPayload | null;
  // Métodos CRUD adicionales
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
}
