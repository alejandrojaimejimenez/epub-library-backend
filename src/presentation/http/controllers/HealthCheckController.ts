import { Request, Response } from 'express';

export class HealthCheckController {
  static check(req: Request, res: Response) {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando correctamente'
    });
  }
}
