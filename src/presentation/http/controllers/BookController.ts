import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SearchBooksDTO } from '@dtos/book/SearchBooksDTO';
import { GetBookDTO } from '@dtos/book/GetBookDTO';
import { SBookService } from '@services/SBookService';
import { SSearchService } from '@services/SSearchService';
import { BaseController } from './BaseController';

export class BookController extends BaseController {
  private bookService: SBookService;
  private searchService: SSearchService;

  constructor() {
    super();
    this.bookService = container.resolve(SBookService);
    this.searchService = container.resolve(SSearchService);
  }

  // GET /api/v1/books
  async getAll(req: Request, res: Response) {
    try {
      const dto = plainToInstance(SearchBooksDTO, req.query);
      await validateOrReject(dto);
      const { limit = 20, offset = 0 } = req.query;
      const result = await this.bookService.getAllBooks(Number(limit), Number(offset));
      return res.json({ success: true, data: result });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }

  // GET /api/v1/books/search
  async search(req: Request, res: Response) {
    try {
      const dto = plainToInstance(SearchBooksDTO, req.query);
      await validateOrReject(dto);
      const { q, author, tag, series, limit = 20, offset = 0 } = dto;
      const result = await this.searchService.searchWithFilters(q, author, tag, series, limit, offset);
      return res.json({ success: true, data: result });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }

  // GET /api/v1/books/:id
  async getById(req: Request, res: Response) {
    try {
      const dto = plainToInstance(GetBookDTO, { id: Number(req.params.id) });
      await validateOrReject(dto);
      const book = await this.bookService.getBookWithDetails(dto.id);
      if (!book) return res.status(404).json({ success: false, message: 'Libro no encontrado' });
      return res.json({ success: true, data: book });
    } catch (error) {
      return this.handleError(res, error, 400);
    }
  }

  // GET /api/v1/books/:id/epub
  async downloadEpub(req: Request, res: Response) {
    try {
      const bookId = Number(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ success: false, message: 'ID de libro inválido' });
      }
      // Buscar el libro
      const book = await this.bookService.getBookById(bookId);
      if (!book) {
        return res.status(404).json({ success: false, message: 'Libro no encontrado' });
      }
      // Construir la ruta al archivo EPUB
      const fs = await import('fs');
      const path = await import('path');
      const config = (await import('@config/index')).default;
      const booksRoot = config.booksPath;
      const authorDirs = fs.readdirSync(booksRoot);
      let epubPath = '';
      for (const authorDir of authorDirs) {
        const authorPath = path.join(booksRoot, authorDir);
        if (!fs.statSync(authorPath).isDirectory()) continue;
        const bookDirs = fs.readdirSync(authorPath);
        for (const bookDir of bookDirs) {
          if (bookDir.endsWith(`(${bookId})`)) {
            const bookFolder = path.join(authorPath, bookDir);
            const files = fs.readdirSync(bookFolder);
            const epubFile = files.find(f => f.endsWith('.epub'));
            if (epubFile) {
              epubPath = path.join(bookFolder, epubFile);
              break;
            }
          }
        }
        if (epubPath) break;
      }
      // Log de depuración: mostrar la ruta buscada y si existe
      // eslint-disable-next-line no-console
      console.log('[BookController] EPUB buscado:', epubPath, 'Existe:', epubPath && fs.existsSync(epubPath));
      if (!epubPath || !fs.existsSync(epubPath)) {
        return res.status(404).json({ success: false, message: 'Archivo EPUB no encontrado', debugPath: epubPath });
      }
      // Enviar el archivo EPUB
      return res.sendFile(path.resolve(epubPath), { headers: { 'Content-Type': 'application/epub+zip' } });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[BookController] Error en downloadEpub:', error);
      return this.handleError(res, error, 500);
    }
  }
}
