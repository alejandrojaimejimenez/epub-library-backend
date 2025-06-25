import { Book } from '@models/Book';
import { LastReadPosition } from '@models/LastReadPosition';

export interface IBookWriteRepository {
  createBook(bookData: Omit<Book, 'id'>): Promise<Book>;
  updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  upsertLastReadPosition(userId: number, bookId: number, position: number): Promise<LastReadPosition>;
}
