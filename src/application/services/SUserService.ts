import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '@repositories/IUserRepository';
import { User } from '@models/User';
import { UserPayload } from '@models/User';
import { CreateUserDTO } from '@dtos/user/CreateUserDTO';
import { UpdateUserDTO } from '@dtos/user/UpdateUserDTO';

@injectable()
export class SUserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    // Adaptar DTO a modelo User si es necesario
    const user: User = {
      // id será asignado por la base de datos, no se incluye
      username: dto.username,
      email: dto.email,
      password: dto.password,
    };
    return this.userRepository.createUser(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    return this.userRepository.updateUser(id, dto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return this.userRepository.validatePassword(user, password);
  }

  generateToken(user: UserPayload): string {
    return this.userRepository.generateToken(user);
  }

  verifyToken(token: string): UserPayload | null {
    return this.userRepository.verifyToken(token);
  }
}
