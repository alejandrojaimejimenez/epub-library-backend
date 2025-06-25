import { injectable } from 'tsyringe';
import { ITagRepository } from '@repositories/ITagRepository';
import { Tag } from '@models/Tag';

@injectable()
export class TagRepository implements ITagRepository {
  async getTagsByBookId(bookId: number): Promise<Tag[]> {
    // Implementación real pendiente
    return [];
  }
}
