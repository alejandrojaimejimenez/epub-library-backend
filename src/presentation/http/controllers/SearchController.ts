import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { BaseController } from './BaseController';
import { SSearchService } from '@services/SSearchService';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { SearchBooksDTO } from '@dtos/book/SearchBooksDTO';

export class SearchController extends BaseController {
  private searchService: SSearchService;

  constructor() {
    super();
    this.searchService = container.resolve(SSearchService);
  }

  async search(req: Request, res: Response) {
    try {
      const dto = plainToInstance(SearchBooksDTO, {
        q: req.query.q,
        author: req.query.author,
        tag: req.query.tag,
        series: req.query.series,
        limit: req.query.limit,
        offset: req.query.offset
      });
      await validateOrReject(dto);

      const result = await this.searchService.searchWithFilters(
        dto.q,
        dto.author ? Number(dto.author) : undefined,
        dto.tag ? Number(dto.tag) : undefined,
        dto.series ? Number(dto.series) : undefined,
        dto.limit ? Number(dto.limit) : 20,
        dto.offset ? Number(dto.offset) : 0
      );

      return res.json({
        success: true,
        data: result.books,
        total: result.total,
        filters: { q: dto.q, author: dto.author, tag: dto.tag, series: dto.series },
        limit: dto.limit ? Number(dto.limit) : 20,
        offset: dto.offset ? Number(dto.offset) : 0
      });
    } catch (error) {
      return this.handleError(res, error, 500);
    }
  }
}
