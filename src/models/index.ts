export interface Book {
  id: number;
  title: string;
  sort?: string;
  timestamp?: string;
  pubdate?: string;
  series_index: number;
  author_sort?: string;
  isbn?: string;
  lccn?: string;
  path: string;
  flags: number;
  uuid?: string;
  has_cover?: boolean;
  last_modified: string;
}

export interface Author {
  id: number;
  name: string;
  sort?: string;
  link: string;
}

export interface Tag {
  id: number;
  name: string;
  link: string;
}

export interface Series {
  id: number;
  name: string;
  sort?: string;
  link: string;
}

export interface Publisher {
  id: number;
  name: string;
  sort?: string;
  link: string;
}

export interface Comment {
  id: number;
  book: number;
  text: string;
}

export interface BookAuthorLink {
  id: number;
  book: number;
  author: number;
}

export interface BookTagLink {
  id: number;
  book: number;
  tag: number;
}

export interface BookSeriesLink {
  id: number;
  book: number;
  series: number;
}

export interface BookFormat {
  id: number;
  book: number;
  format: string;
  uncompressed_size: number;
  name: string;
}

export interface LastReadPosition {
  id: number;
  book: number;
  format: string;
  user: string;
  device: string;
  cfi: string;
  epoch: number;
  pos_frac: number;
}

// Interfaces para respuestas de la API
export interface BookWithDetails extends Book {
  authors: Author[];
  tags: Tag[];
  series?: Series;
  publisher?: Publisher;
  comments?: string;
  formats: string[];
  cover_path?: string;
  last_position?: LastReadPosition;
}

export interface SearchResult {
  books: BookWithDetails[];
  total: number;
}

// Exportar modelos de usuario
export * from './user';
