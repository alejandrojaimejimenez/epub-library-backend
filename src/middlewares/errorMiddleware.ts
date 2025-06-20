import { Request, Response, NextFunction } from 'express';

// Middleware para capturar errores no manejados en rutas asíncronas
export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para manejar errores 404 (rutas no encontradas)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
};

// Middleware para manejar todos los errores
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no manejado:', err);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};

export default {
  asyncErrorHandler,
  notFoundHandler,
  errorHandler
};
