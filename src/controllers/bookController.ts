import { Request, Response } from 'express';
import { BookService } from '../services';
import path from 'path';
import config from '../config';
import fs from 'fs';

// Controlador para los libros
export const BookController = {
  // Obtener todos los libros con paginación
  getAllBooks(req: Request, res: Response): void {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      const books = BookService.getAllBooks(limit, offset);
      res.json({
        success: true,
        data: books,
        total: books.length,
        limit,
        offset
      });
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los libros',
        error: (error as Error).message
      });
    }
  },

  // Obtener un libro por ID
  getBookById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de libro inválido'
        });
        return;
      }
      
      const book = BookService.getBookWithDetails(id);
      
      if (!book) {
        res.status(404).json({
          success: false,
          message: `Libro con ID ${id} no encontrado`
        });
        return;
      }
      
      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      console.error(`Error al obtener el libro con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el libro',
        error: (error as Error).message
      });
    }
  },

  // Buscar libros por título
  searchBooks(req: Request, res: Response): void {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Parámetro de búsqueda no proporcionado'
        });
        return;
      }
      
      const books = BookService.searchBooks(query, limit, offset);
      
      res.json({
        success: true,
        data: books,
        total: books.length,
        query,
        limit,
        offset
      });
    } catch (error) {
      console.error('Error al buscar libros:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar libros',
        error: (error as Error).message
      });
    }
  },

  // Actualizar la posición de lectura de un libro
  updateReadingPosition(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de libro inválido'
        });
        return;
      }
        const { format = 'EPUB', user = 'default', device = 'default', cfi = '', position } = req.body;
      
      if (position === undefined) {
        res.status(400).json({
          success: false,
          message: 'Falta la posición de lectura'
        });
        return;
      }
      
      const posFrac = parseFloat(position);
      
      if (isNaN(posFrac)) {
        res.status(400).json({
          success: false,
          message: 'Posición de lectura inválida'
        });
        return;
      }
      
      BookService.updateReadingPosition(id, format, user, device, cfi, posFrac);
      
      res.json({
        success: true,
        message: 'Posición de lectura actualizada correctamente'
      });
    } catch (error) {
      console.error(`Error al actualizar la posición de lectura del libro con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la posición de lectura',
        error: (error as Error).message
      });
    }
  },
  // Obtener archivo de libro (EPUB, portada, etc.)
  getBookFile(req: Request, res: Response): void {
    try {
      const filePath = req.params.filepath;
      
      if (!filePath) {
        res.status(400).json({
          success: false,
          message: 'Ruta de archivo no proporcionada'
        });
        return;
      }
      
      // Prevenir acceso a archivos fuera del directorio de libros
      const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
      const fullPath = path.join(config.booksPath, normalizedPath);
      
      // Verificar que el archivo existe
      if (!fs.existsSync(fullPath)) {
        res.status(404).json({
          success: false,
          message: 'Archivo no encontrado'
        });
        return;
      }
      
      // Detectar el tipo de archivo
      const ext = path.extname(fullPath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (ext) {
        case '.epub':
          contentType = 'application/epub+zip';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.pdf':
          contentType = 'application/pdf';
          break;
      }
      
      res.setHeader('Content-Type', contentType);
      
      // Enviar el archivo como respuesta
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error(`Error al obtener el archivo ${req.params.path}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el archivo',
        error: (error as Error).message
      });
    }
  },

  // Obtener el archivo EPUB de un libro
  getBookEpub(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de libro inválido'
        });
        return;
      }
      
      // Obtener la ruta al archivo EPUB
      const epubPath = BookService.getBookEpubPath(id);
      
      if (!epubPath) {
        res.status(404).json({
          success: false,
          message: `No se encontró un archivo EPUB para el libro con ID ${id}`
        });
        return;
      }
      
      // Comprobar que el archivo existe
      const fullPath = path.join(config.booksPath, epubPath);
      if (!fs.existsSync(fullPath)) {
        res.status(404).json({
          success: false,
          message: `Archivo EPUB no encontrado en el sistema de archivos`
        });
        return;
      }
      
      // Establecer las cabeceras para la descarga
      res.setHeader('Content-Type', 'application/epub+zip');
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(fullPath)}"`);
      
      // Enviar el archivo
      const fileStream = fs.createReadStream(fullPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error(`Error al obtener el EPUB del libro con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el archivo EPUB',
        error: (error as Error).message
      });
    }
  },
  // Obtener la posición de lectura de un libro
  getReadingPosition(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de libro inválido'
        });
        return;
      }
      
      // Obtener parámetros opcionales de la consulta
      const format = req.query.format as string || 'EPUB';
      const user = req.query.user as string || 'usuario1'; // Cambiado a 'usuario1' para coincidir con el PUT
      const device = req.query.device as string || 'browser'; // Cambiado a 'browser' para coincidir con el PUT
      
      // Obtener la posición de lectura
      const position = BookService.getReadingPosition(id, format, user, device);
      
      res.json({
        success: true,
        data: position
      });
    } catch (error) {
      console.error(`Error al obtener la posición de lectura del libro con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la posición de lectura',
        error: (error as Error).message
      });
    }
  },
};
