import { injectable, inject } from 'tsyringe';
import { IBookReadRepository } from '@repositories/IBookReadRepository';
import { IAuthorRepository } from '@repositories/IAuthorRepository';
import { ITagRepository } from '@repositories/ITagRepository';
import { Book, BookWithDetails } from '@models/Book';

@injectable()
export class SBookService {
  constructor(
    @inject('IBookReadRepository') private bookRepo: IBookReadRepository,
    @inject('IAuthorRepository') private authorRepo: IAuthorRepository,
    @inject('ITagRepository') private tagRepo: ITagRepository
  ) {}

  async getAllBooks(limit = 20, offset = 0): Promise<Book[]> {
    return this.bookRepo.getAllBooks(limit, offset);
  }

  async getBookById(id: number): Promise<Book | null> {
    const book = await this.bookRepo.getBookById(id);
    return book ?? null;
  }

  async getBookWithDetails(id: number): Promise<BookWithDetails | null> {
    // Orquestar detalles usando los repositorios
    // Por ahora, solo retorna el libro base si existe
    const book = await this.bookRepo.getBookById(Number(id));
    if (!book) return null;
    // Aquí podrías agregar autores, tags, etc.
    return { ...book } as BookWithDetails;
  }
}
