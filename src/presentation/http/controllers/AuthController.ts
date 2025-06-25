import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { LoginDTO } from '@dtos/auth/LoginDTO';
import { RegisterDTO } from '@dtos/auth/RegisterDTO';
import { SAuthService } from '@services/SAuthService';
import { User } from '@models/User';
import { BaseController } from './BaseController';

export class AuthController extends BaseController {
  private authService: SAuthService;

  constructor() {
    super();
    this.authService = container.resolve(SAuthService);
  }

  async register(req: Request, res: Response) {
    try {
      const dto = plainToInstance(RegisterDTO, req.body);
      await validateOrReject(dto);
      const user = await this.authService.register(dto);
      const token = this.authService.generateToken({
        id: user.id!,
        username: user.username,
        email: user.email
      });
      return res.status(201).json({ token, user });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const dto = plainToInstance(LoginDTO, req.body);
      await validateOrReject(dto);
      const user = await this.authService.validateUser(dto);
      if (!user) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      const token = this.authService.generateToken({
        id: user.id!,
        username: user.username,
        email: user.email
      });
      return res.json({ token, user });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      return res.json({ user });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }
}
