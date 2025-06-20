import { query, queryOne, execute } from '../utils/database';
import { Book, Author, Tag, Series, Comment, BookWithDetails, LastReadPosition } from '../models';
import path from 'path';
import config from '../config';

// Convertimos las funciones a síncronas ya que better-sqlite3 es síncrono
// Servicio para los libros
export const BookService = {
  // Obtener todos los libros con paginación
  getAllBooks(limit = 20, offset = 0): Book[] {
    const sql = `
      SELECT * FROM books
      ORDER BY title
      LIMIT ? OFFSET ?
    `;
    return query<Book>(sql, [limit, offset]);
  },

  // Obtener un libro por ID
  getBookById(id: number): Book | undefined {
    const sql = 'SELECT * FROM books WHERE id = ?';
    return queryOne<Book>(sql, [id]);
  },

  // Obtener libro con todos sus detalles (autores, tags, serie, etc.)
  getBookWithDetails(id: number): BookWithDetails | undefined {
    const book = this.getBookById(id);
    
    if (!book) {
      return undefined;
    }

    // Obtener autores del libro
    const authors = AuthorService.getAuthorsByBookId(id);
    
    // Obtener tags del libro
    const tags = TagService.getTagsByBookId(id);
    
    // Obtener serie del libro
    const seriesLink = queryOne<{ series: number }>(
      'SELECT series FROM books_series_link WHERE book = ?',
      [id]
    );
    
    let series;
    if (seriesLink) {
      series = queryOne<Series>(
        'SELECT * FROM series WHERE id = ?',
        [seriesLink.series]
      );
    }
    
    // Obtener comentarios del libro
    const comment = queryOne<Comment>(
      'SELECT * FROM comments WHERE book = ?',
      [id]
    );
    
    // Obtener formatos disponibles
    const formats = query<{ format: string }>(
      'SELECT format FROM data WHERE book = ?',
      [id]
    );
    
    // Obtener última posición de lectura
    const lastPosition = queryOne<LastReadPosition>(
      'SELECT * FROM last_read_positions WHERE book = ? ORDER BY epoch DESC LIMIT 1',
      [id]
    );
    
    // Construir la ruta de la portada
    const coverPath = book.has_cover 
      ? path.join(book.path, 'cover.jpg').replace(/\\/g, '/')
      : undefined;
    
    // Construir el objeto con todos los detalles
    const bookWithDetails: BookWithDetails = {
      ...book,
      authors,
      tags,
      series,
      comments: comment?.text,
      formats: formats.map(f => f.format),
      cover_path: coverPath,
      last_position: lastPosition
    };
    
    return bookWithDetails;
  },
  // Buscar libros por título
  searchBooks(searchQuery: string, limit = 20, offset = 0): Book[] {
    const searchTerm = `%${searchQuery}%`;
    const sql = `
      SELECT * FROM books
      WHERE title LIKE ?
      ORDER BY title
      LIMIT ? OFFSET ?
    `;
    return query<Book>(sql, [searchTerm, limit, offset]);
  },
  // Actualizar la posición de lectura
  updateReadingPosition(
    bookId: number, 
    format: string,
    user: string,
    device: string,
    cfi: string,
    posFrac: number
  ): void {
    // Verificar si existe una entrada
    const existingPosition = queryOne<LastReadPosition>(
      'SELECT * FROM last_read_positions WHERE book = ? AND format = ? AND user = ? AND device = ?',
      [bookId, format, user, device]
    );

    const epoch = Math.floor(Date.now() / 1000);

    if (existingPosition) {
      // Actualizar la entrada existente
      const updateSql = `
        UPDATE last_read_positions
        SET cfi = ?, epoch = ?, pos_frac = ?
        WHERE id = ?
      `;
      execute(updateSql, [cfi, epoch, posFrac, existingPosition.id]);
    } else {
      // Crear una nueva entrada
      const insertSql = `
        INSERT INTO last_read_positions (book, format, user, device, cfi, epoch, pos_frac)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      execute(insertSql, [bookId, format, user, device, cfi, epoch, posFrac]);
    }
  },
  // Obtener la ruta al archivo EPUB de un libro
  getBookEpubPath(id: number): string | null {
    // Obtener la información del libro
    const book = this.getBookById(id);
    if (!book) {
      return null;
    }

    // Buscar el formato EPUB en la tabla de datos
    const epubData = queryOne<{ name: string }>(
      'SELECT name FROM data WHERE book = ? AND format = ?',
      [id, 'EPUB']
    );

    if (!epubData) {
      return null;
    }    // Construir la ruta completa al archivo
    return path.join(book.path, epubData.name + '.epub');
  },
};

// Servicio para los autores
export const AuthorService = {
  // Obtener todos los autores
  getAllAuthors(): Author[] {
    const sql = 'SELECT * FROM authors ORDER BY sort';
    return query<Author>(sql, []);
  },

  // Obtener un autor por ID
  getAuthorById(id: number): Author | undefined {
    const sql = 'SELECT * FROM authors WHERE id = ?';
    return queryOne<Author>(sql, [id]);
  },

  // Obtener autores de un libro
  getAuthorsByBookId(bookId: number): Author[] {
    const sql = `
      SELECT a.* FROM authors a
      JOIN books_authors_link bal ON a.id = bal.author
      WHERE bal.book = ?
      ORDER BY a.sort
    `;
    return query<Author>(sql, [bookId]);
  },

  // Obtener libros de un autor
  getBooksByAuthor(authorId: number, limit = 20, offset = 0): Book[] {
    const sql = `
      SELECT b.* FROM books b
      JOIN books_authors_link bal ON b.id = bal.book
      WHERE bal.author = ?
      ORDER BY b.title
      LIMIT ? OFFSET ?
    `;
    return query<Book>(sql, [authorId, limit, offset]);
  }
};

// Servicio para las etiquetas
export const TagService = {
  // Obtener todas las etiquetas
  getAllTags(): Tag[] {
    const sql = 'SELECT * FROM tags ORDER BY name';
    return query<Tag>(sql, []);
  },

  // Obtener una etiqueta por ID
  getTagById(id: number): Tag | undefined {
    const sql = 'SELECT * FROM tags WHERE id = ?';
    return queryOne<Tag>(sql, [id]);
  },

  // Obtener etiquetas de un libro
  getTagsByBookId(bookId: number): Tag[] {
    const sql = `
      SELECT t.* FROM tags t
      JOIN books_tags_link btl ON t.id = btl.tag
      WHERE btl.book = ?
      ORDER BY t.name
    `;
    return query<Tag>(sql, [bookId]);
  },

  // Obtener libros por etiqueta
  getBooksByTag(tagId: number, limit = 20, offset = 0): Book[] {
    const sql = `
      SELECT b.* FROM books b
      JOIN books_tags_link btl ON b.id = btl.book
      WHERE btl.tag = ?
      ORDER BY b.title
      LIMIT ? OFFSET ?
    `;
    return query<Book>(sql, [tagId, limit, offset]);
  }
};

// Servicio para las series
export const SeriesService = {
  // Obtener todas las series
  getAllSeries(): Series[] {
    const sql = 'SELECT * FROM series ORDER BY sort';
    return query<Series>(sql, []);
  },

  // Obtener una serie por ID
  getSeriesById(id: number): Series | undefined {
    const sql = 'SELECT * FROM series WHERE id = ?';
    return queryOne<Series>(sql, [id]);
  },

  // Obtener libros de una serie
  getBooksBySeries(seriesId: number, limit = 20, offset = 0): Book[] {
    const sql = `
      SELECT b.* FROM books b
      JOIN books_series_link bsl ON b.id = bsl.book
      WHERE bsl.series = ?
      ORDER BY b.series_index, b.title
      LIMIT ? OFFSET ?
    `;
    return query<Book>(sql, [seriesId, limit, offset]);
  }
};

// Servicio para búsquedas avanzadas
export const SearchService = {
  // Buscar libros con filtros múltiples
  searchWithFilters(
    searchTerm?: string,
    authorId?: number,
    tagId?: number,
    seriesId?: number,
    limit = 20,
    offset = 0
  ): Book[] {
    let conditions = [];
    let params = [];

    // Construir la consulta base
    let sql = `
      SELECT DISTINCT b.* FROM books b
    `;

    // Añadir joins si necesario
    if (authorId) {
      sql += ` JOIN books_authors_link bal ON b.id = bal.book`;
      conditions.push(`bal.author = ?`);
      params.push(authorId);
    }

    if (tagId) {
      sql += ` JOIN books_tags_link btl ON b.id = btl.book`;
      conditions.push(`btl.tag = ?`);
      params.push(tagId);
    }

    if (seriesId) {
      sql += ` JOIN books_series_link bsl ON b.id = bsl.book`;
      conditions.push(`bsl.series = ?`);
      params.push(seriesId);
    }

    // Añadir búsqueda por texto
    if (searchTerm) {
      conditions.push(`(b.title LIKE ? OR b.author_sort LIKE ?)`);
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Añadir condiciones WHERE si hay alguna
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Ordenar y limitar resultados
    sql += `
      ORDER BY b.title
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    return query<Book>(sql, params);
  }
};

// Exportar los servicios para su uso en los controladores
export default {
  BookService,
  AuthorService,
  TagService,
  SeriesService,
  SearchService
};
