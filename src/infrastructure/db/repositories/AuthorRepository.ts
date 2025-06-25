import { injectable } from 'tsyringe';
import { IAuthorRepository } from '@repositories/IAuthorRepository';
import { Author } from '@models/Author';
import { query } from '@utils/database';

@injectable()
export class AuthorRepository implements IAuthorRepository {
  async getAuthorsByBookId(bookId: number): Promise<Author[]> {
    return query<Author>(
      'SELECT a.* FROM authors a JOIN books_authors_link bal ON a.id = bal.author WHERE bal.book = ?',
      [bookId]
    );
  }
  // Implementar otros métodos según necesidades
}
