import { Book } from './Book';
import { Author } from './Author';
import { Tag } from './Tag';
import { Series } from './Series';
import { Comment } from './Comment';

export interface BookWithDetails extends Book {
  authors: Author[];
  tags: Tag[];
  series?: Series;
  comments: Comment[];
}
