import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';

export abstract class BaseController {
  protected userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  /**
   * Middleware para verificar si el usuario está autenticado
   */
  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Obtener el token del header de autorización
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: 'No authorization header provided' });
        return;
      }

      const token = authHeader.split(' ')[1]; // Bearer <token>
      if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      // Verificar el token
      const user = this.userService.verifyToken(token);
      if (!user) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }

      // Añadir el usuario a la request para usarlo en los controladores
      (req as any).user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }

  /**
   * Método para manejar los errores
   */
  protected handleError(res: Response, error: any): Response {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
