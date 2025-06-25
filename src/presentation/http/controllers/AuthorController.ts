import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SAuthorService } from '@services/SAuthorService';
import { BaseController } from './BaseController';

export class AuthorController extends BaseController {
  private authorService: SAuthorService;

  constructor() {
    super();
    this.authorService = container.resolve(SAuthorService);
  }

  async getAuthorsByBookId(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.bookId, 10);
      if (isNaN(bookId)) {
        return res.status(400).json({ success: false, message: 'ID de libro inválido' });
      }
      const authors = await this.authorService.getAuthorsByBookId(bookId);
      return res.json({ success: true, data: authors });
    } catch (error) {
      return this.handleError(res, error, 500);
    }
  }
  // Agregar más métodos según necesidades
}
