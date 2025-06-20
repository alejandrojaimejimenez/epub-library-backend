import { Request, Response } from 'express';
import { SearchService } from '../services';

// Controlador para las búsquedas
export const SearchController = {
  // Búsqueda avanzada con filtros
  search(req: Request, res: Response): void {
    try {
      const { q, author, tag, series } = req.query;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      // Convertir los parámetros a números si están presentes
      const authorId = author ? parseInt(author as string, 10) : undefined;
      const tagId = tag ? parseInt(tag as string, 10) : undefined;
      const seriesId = series ? parseInt(series as string, 10) : undefined;
      
      // Validar que al menos un criterio de búsqueda esté presente
      if (!q && !authorId && !tagId && !seriesId) {
        res.status(400).json({
          success: false,
          message: 'Se requiere al menos un criterio de búsqueda (q, author, tag, series)'
        });
        return;
      }
      
      // Realizar la búsqueda
      const books = SearchService.searchWithFilters(
        q as string | undefined,
        authorId,
        tagId,
        seriesId,
        limit,
        offset
      );
      
      res.json({
        success: true,
        data: books,
        total: books.length,
        filters: {
          q,
          author: authorId,
          tag: tagId,
          series: seriesId
        },
        limit,
        offset
      });
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      res.status(500).json({
        success: false,
        message: 'Error al realizar la búsqueda',
        error: (error as Error).message
      });
    }
  }
};
