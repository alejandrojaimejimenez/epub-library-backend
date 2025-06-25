import { injectable, inject } from 'tsyringe';
import { IAuthorRepository } from '@repositories/IAuthorRepository';
import { Author } from '@models/Author';

@injectable()
export class SAuthorService {
  constructor(
    @inject('IAuthorRepository')
    private readonly authorRepository: IAuthorRepository
  ) {}

  async getAuthorsByBookId(bookId: number): Promise<Author[]> {
    return this.authorRepository.getAuthorsByBookId(bookId);
  }
  // Agregar más métodos según necesidades
}
