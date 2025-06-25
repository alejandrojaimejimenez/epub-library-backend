import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import { container } from '@shared/container';
import { SUserService } from '@services/SUserService';

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  (async () => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
      }
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, config.jwt.secret) as { id: string | number };
      // Asegurar que el id es string para la consulta
      const userId = typeof payload.id === 'number' ? payload.id.toString() : payload.id;
      const userService = container.resolve(SUserService);
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuario no válido' });
      }
      (req as any).user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  })();
}
