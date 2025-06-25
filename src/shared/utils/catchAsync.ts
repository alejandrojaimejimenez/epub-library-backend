// catchAsync.ts
// Utilidad para envolver handlers async y propagar errores a next()
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function catchAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
