import { injectable, inject } from 'tsyringe';
import { IBookReadRepository } from '@repositories/IBookReadRepository';
import { Book } from '@models/Book';

@injectable()
export class SSearchService {
  constructor(
    @inject('IBookReadRepository') private bookRepo: IBookReadRepository
  ) {}

  async searchWithFilters(
    q?: string,
    authorId?: number,
    tagId?: number,
    seriesId?: number,
    limit = 20,
    offset = 0
  ): Promise<{ books: Book[]; total: number }> {
    return this.bookRepo.searchBooks(q, authorId, tagId, seriesId, limit, offset);
  }
}
