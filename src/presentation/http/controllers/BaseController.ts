import { Response } from 'express';

export abstract class BaseController {
  /**
   * Manejo centralizado de errores para controladores
   */
  protected handleError(res: Response, error: unknown, status = 500) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return res.status(status).json({ success: false, message, error: process.env.NODE_ENV === 'development' ? error : undefined });
  }
}
