import { injectable, inject } from 'tsyringe';
import { ITagRepository } from '@repositories/ITagRepository';
import { Tag } from '@models/Tag';

@injectable()
export class STagService {
  constructor(
    @inject('ITagRepository') private tagRepo: ITagRepository
  ) {}

  async getTagsByBookId(bookId: number): Promise<Tag[]> {
    return this.tagRepo.getTagsByBookId(bookId);
  }
}
