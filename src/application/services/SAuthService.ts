import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '@repositories/IUserRepository';
import { RegisterDTO } from '@dtos/auth/RegisterDTO';
import { LoginDTO } from '@dtos/auth/LoginDTO';
import { User, UserPayload } from '@models/User';
import jwt from 'jsonwebtoken';
import config from '@config/index';

@injectable()
export class SAuthService {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async register(dto: RegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(dto.username);
    if (existingUser) throw new Error('Username already exists');
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) throw new Error('Email already exists');
    const user: User = {
      username: dto.username,
      email: dto.email,
      password: dto.password
    };
    return this.userRepository.createUser(user);
  }

  async validateUser(dto: LoginDTO): Promise<User | null> {
    const user = await this.userRepository.findByUsername(dto.username);
    if (!user) return null;
    const valid = await this.userRepository.validatePassword(user, dto.password);
    return valid ? user : null;
  }

  generateToken(user: UserPayload): string {
    return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }
}
