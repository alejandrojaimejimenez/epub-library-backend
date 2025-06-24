import { Request, Response } from 'express';
import { UserService } from '../services';
import { User, AuthRequest, RegisterRequest } from '../models';
import { BaseController } from './baseController';

export class AuthController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Método para registrar un nuevo usuario
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password } = req.body as RegisterRequest;

      // Validar datos
      if (!username || !email || !password) {
        res.status(400).json({ message: 'Username, email and password are required' });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUserByUsername = await this.userService.findByUsername(username);
      if (existingUserByUsername) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      const existingUserByEmail = await this.userService.findByEmail(email);
      if (existingUserByEmail) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      // Crear el nuevo usuario
      const newUser = await this.userService.createUser({ username, email, password } as User);

      // Generar token
      const token = this.userService.generateToken({
        id: newUser.id!,
        username: newUser.username,
        email: newUser.email
      });

      // Responder con el token y los datos del usuario (sin la contraseña)
      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Método para iniciar sesión
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body as AuthRequest;

      // Validar datos
      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
      }

      // Buscar el usuario
      const user = await this.userService.findByUsername(username);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Verificar la contraseña
      const isPasswordValid = await this.userService.validatePassword(user, password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Generar token
      const token = this.userService.generateToken({
        id: user.id!,
        username: user.username,
        email: user.email
      });

      // Responder con el token y los datos del usuario (sin la contraseña)
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Método para obtener el perfil del usuario actual
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;
      res.json({ user });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
