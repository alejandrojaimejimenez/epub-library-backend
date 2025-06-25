export interface Book {
  id: number;
  title: string;
  author_id: number;
  summary?: string;
  cover_image?: string;
  publication_date?: string;
  series_id?: number;
}

export interface Author {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Series {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  book_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface BookWithDetails extends Book {
  authors: Author[];
  tags: Tag[];
  series?: Series;
  comments: Comment[];
}

export interface LastReadPosition {
  id?: number;
  user_id: number;
  book_id: number;
  position: number;
}
