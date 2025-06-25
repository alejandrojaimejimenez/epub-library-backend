import { Author } from '@models/Author';

export interface IAuthorRepository {
  getAuthorsByBookId(bookId: number): Promise<Author[]>;
  // Otros métodos según necesidades
}
