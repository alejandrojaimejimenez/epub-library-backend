import { Request, Response } from 'express';
import { AuthorService, BookService } from '../services';

// Controlador para los autores
export const AuthorController = {
  // Obtener todos los autores
  getAllAuthors(req: Request, res: Response): void {
    try {
      const authors = AuthorService.getAllAuthors();
      
      res.json({
        success: true,
        data: authors,
        total: authors.length
      });
    } catch (error) {
      console.error('Error al obtener autores:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los autores',
        error: (error as Error).message
      });
    }
  },

  // Obtener un autor por ID
  getAuthorById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de autor inválido'
        });
        return;
      }
      
      const author = AuthorService.getAuthorById(id);
      
      if (!author) {
        res.status(404).json({
          success: false,
          message: `Autor con ID ${id} no encontrado`
        });
        return;
      }
      
      res.json({
        success: true,
        data: author
      });
    } catch (error) {
      console.error(`Error al obtener el autor con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el autor',
        error: (error as Error).message
      });
    }
  },

  // Obtener libros de un autor
  getBooksByAuthor(req: Request, res: Response): void {
    try {
      const name = req.params.name;
      
      if (!name) {
        res.status(400).json({
          success: false,
          message: 'Nombre de autor no proporcionado'
        });
        return;
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      // Buscar el autor por nombre
      const authors = AuthorService.getAllAuthors();
      const author = authors.find(a => a.name.toLowerCase() === name.toLowerCase());
      
      if (!author) {
        res.status(404).json({
          success: false,
          message: `Autor "${name}" no encontrado`
        });
        return;
      }
      
      const books = AuthorService.getBooksByAuthor(author.id, limit, offset);
      
      res.json({
        success: true,
        data: {
          author,
          books,
          total: books.length
        },
        limit,
        offset
      });
    } catch (error) {
      console.error(`Error al obtener los libros del autor ${req.params.name}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los libros del autor',
        error: (error as Error).message
      });
    }
  }
};
