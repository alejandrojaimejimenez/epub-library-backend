import { Request, Response, NextFunction } from 'express';

export function ErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    errors: err.errors || undefined
  });
}
