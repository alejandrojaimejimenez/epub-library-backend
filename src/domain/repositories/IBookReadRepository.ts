import { Book } from '@models/Book';
import { BookWithDetails } from '@models/BookWithDetails';

export interface IBookReadRepository {
  getAllBooks(limit: number, offset: number): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  getBookWithDetails(id: number): Promise<BookWithDetails | undefined>;
  searchBooks(
    q?: string,
    authorId?: number,
    tagId?: number,
    seriesId?: number,
    limit?: number,
    offset?: number
  ): Promise<{ books: Book[]; total: number }>;
}
