import { injectable, inject } from 'tsyringe';
import { IBookReadRepository } from '@repositories/IBookReadRepository';
import { IBookWriteRepository } from '@repositories/IBookWriteRepository';
import { IAuthorRepository } from '@repositories/IAuthorRepository';
import { Book, BookWithDetails, LastReadPosition } from '@models/Book';
import { query, queryOne, execute } from '@utils/database';

@injectable()
export class BookRepository implements IBookReadRepository, IBookWriteRepository {
  constructor(@inject('IAuthorRepository') private authorRepository: IAuthorRepository) {}

  async getAllBooks(limit: number, offset: number): Promise<Book[]> {
    const sql = `SELECT * FROM books ORDER BY title LIMIT ? OFFSET ?`;
    return query<Book>(sql, [limit, offset]);
  }

  async getBookById(id: number): Promise<Book | undefined> {
    const sql = 'SELECT * FROM books WHERE id = ?';
    return queryOne<Book>(sql, [id]);
  }

  async getBookWithDetails(id: number): Promise<BookWithDetails | undefined> {
    const book = await this.getBookById(id);
    if (!book) return undefined;
    const authors = await this.authorRepository.getAuthorsByBookId(id);
    // tags, series, comments: inyectar y usar repositorios similares
    return {
      ...book,
      authors,
      tags: [],
      series: undefined,
      comments: []
    };
  }

  async createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    const sql = `INSERT INTO books (title, author_id, summary, cover_image, publication_date, series_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const { lastID } = execute(sql, [
      bookData.title,
      bookData.author_id,
      bookData.summary,
      bookData.cover_image,
      bookData.publication_date,
      bookData.series_id,
    ]);
    return { id: lastID, ...bookData };
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const sql = `UPDATE books SET title = ?, author_id = ?, summary = ?, cover_image = ?, publication_date = ?, series_id = ? WHERE id = ?`;
    execute(sql, [
      bookData.title,
      bookData.author_id,
      bookData.summary,
      bookData.cover_image,
      bookData.publication_date,
      bookData.series_id,
      id,
    ]);
    return this.getBookById(id);
  }

  async deleteBook(id: number): Promise<boolean> {
    const sql = 'DELETE FROM books WHERE id = ?';
    const { changes } = execute(sql, [id]);
    return changes > 0;
  }

  async getLastReadPosition(userId: number, bookId: number): Promise<LastReadPosition | undefined> {
    const sql = 'SELECT * FROM last_read_positions WHERE user_id = ? AND book_id = ?';
    return queryOne<LastReadPosition>(sql, [userId, bookId]);
  }

  async upsertLastReadPosition(userId: number, bookId: number, position: number): Promise<LastReadPosition> {
    const sql = `INSERT INTO last_read_positions (user_id, book_id, position) VALUES (?, ?, ?) ON CONFLICT(user_id, book_id) DO UPDATE SET position = excluded.position`;
    const { lastID } = execute(sql, [userId, bookId, position]);
    return { user_id: userId, book_id: bookId, position, id: lastID };
  }

  async searchBooks(
    q?: string,
    authorId?: number,
    tagId?: number,
    seriesId?: number,
    limit = 20,
    offset = 0
  ): Promise<{ books: Book[]; total: number }> {
    let where: string[] = [];
    let params: any[] = [];

    if (q) {
      where.push('(title LIKE ? OR summary LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (authorId) {
      where.push('author_id = ?');
      params.push(authorId);
    }
    if (seriesId) {
      where.push('series_id = ?');
      params.push(seriesId);
    }
    if (tagId) {
      // Suponiendo una tabla de relación book_tags (book_id, tag_id)
      where.push('id IN (SELECT book_id FROM book_tags WHERE tag_id = ?)');
      params.push(tagId);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM books ${whereClause} ORDER BY title LIMIT ? OFFSET ?`;
    const sqlCount = `SELECT COUNT(*) as total FROM books ${whereClause}`;

    const books = await query<Book>(sql, [...params, limit, offset]);
    const countResult = await queryOne<{ total: number }>(sqlCount, params);
    const total = countResult ? countResult.total : 0;

    return { books, total };
  }
}
