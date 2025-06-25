import { Tag } from '@models/Tag';

export interface ITagRepository {
  getTagsByBookId(bookId: number): Promise<Tag[]>;
  // Agrega aquí otros métodos relacionados con tags si es necesario
}
