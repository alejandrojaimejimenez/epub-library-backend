import { IBookReadRepository } from '@repositories/IBookReadRepository';
import { IBookWriteRepository } from '@repositories/IBookWriteRepository';
import { Book, BookWithDetails } from '@models/Book';
import { SearchBooksDTO } from '@dtos/book/SearchBooksDTO';
import { UpdateReadingPositionDTO } from '@dtos/book/UpdateReadingPositionDTO';

export class BookService {
  constructor(
    private bookReadRepository: IBookReadRepository,
    private bookWriteRepository: IBookWriteRepository
  ) {}

  async getBookById(id: number): Promise<Book | undefined> {
    return this.bookReadRepository.getBookById(id);
  }

  async getBookWithDetails(id: number): Promise<BookWithDetails | undefined> {
    return this.bookReadRepository.getBookWithDetails(id);
  }

  async createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    if (!bookData.title || bookData.title.length < 2) {
      throw new Error('El título es demasiado corto');
    }
    return this.bookWriteRepository.createBook(bookData);
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    return this.bookWriteRepository.updateBook(id, bookData);
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.bookWriteRepository.deleteBook(id);
  }

  async getAllBooks(dto: SearchBooksDTO): Promise<Book[]> {
    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;
    return this.bookReadRepository.getAllBooks(limit, offset);
  }

  async searchBooks(dto: SearchBooksDTO): Promise<Book[]> {
    // Aquí deberías implementar la búsqueda real usando el repositorio
    // Por ahora, solo ejemplo: buscar por título si q está presente
    const allBooks = await this.bookReadRepository.getAllBooks(dto.limit ?? 20, dto.offset ?? 0);
    if (dto.q) {
      return allBooks.filter(book => book.title.toLowerCase().includes(dto.q!.toLowerCase()));
    }
    return allBooks;
  }

  async updateReadingPosition(dto: UpdateReadingPositionDTO): Promise<void> {
    // Aquí deberías implementar la lógica real usando el repositorio
    // Por ahora, solo ejemplo:
    await this.bookWriteRepository.upsertLastReadPosition(
      1, // userId (debería venir del token o dto)
      dto.bookId,
      dto.position
    );
  }
}
