import { Book } from '@models/Book';
import { BookWithDetails } from '@models/BookWithDetails';
import { LastReadPosition } from '@models/LastReadPosition';

// Repositorio de solo lectura para libros
export interface IBookReadRepository {
  getAllBooks(limit: number, offset: number): Promise<Book[]>;
  getBookById(id: number): Promise<Book | null>;
  getBookWithDetails(id: number): Promise<BookWithDetails | null>;
  getLastReadPosition(userId: number, bookId: number): Promise<LastReadPosition | null>;
}

// Repositorio de solo escritura para libros
export interface IBookWriteRepository {
  createBook(bookData: Omit<Book, 'id'>): Promise<Book>;
  updateBook(id: number, bookData: Partial<Book>): Promise<Book | null>;
  deleteBook(id: number): Promise<boolean>;
  upsertLastReadPosition(userId: number, bookId: number, position: number): Promise<LastReadPosition>;
}
