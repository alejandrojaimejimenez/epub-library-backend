import { Request, Response } from 'express';
import { TagService } from '../services';

// Controlador para las etiquetas
export const TagController = {
  // Obtener todas las etiquetas
  getAllTags(req: Request, res: Response): void {
    try {
      const tags = TagService.getAllTags();
      
      res.json({
        success: true,
        data: tags,
        total: tags.length
      });
    } catch (error) {
      console.error('Error al obtener etiquetas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las etiquetas',
        error: (error as Error).message
      });
    }
  },

  // Obtener una etiqueta por ID
  getTagById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de etiqueta inválido'
        });
        return;
      }
      
      const tag = TagService.getTagById(id);
      
      if (!tag) {
        res.status(404).json({
          success: false,
          message: `Etiqueta con ID ${id} no encontrada`
        });
        return;
      }
      
      res.json({
        success: true,
        data: tag
      });
    } catch (error) {
      console.error(`Error al obtener la etiqueta con ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la etiqueta',
        error: (error as Error).message
      });
    }
  },

  // Obtener libros por etiqueta
  getBooksByTag(req: Request, res: Response): void {
    try {
      const name = req.params.name;
      
      if (!name) {
        res.status(400).json({
          success: false,
          message: 'Nombre de etiqueta no proporcionado'
        });
        return;
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      
      // Buscar la etiqueta por nombre
      const tags = TagService.getAllTags();
      const tag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
      
      if (!tag) {
        res.status(404).json({
          success: false,
          message: `Etiqueta "${name}" no encontrada`
        });
        return;
      }
      
      const books = TagService.getBooksByTag(tag.id, limit, offset);
      
      res.json({
        success: true,
        data: {
          tag,
          books,
          total: books.length
        },
        limit,
        offset
      });
    } catch (error) {
      console.error(`Error al obtener los libros de la etiqueta ${req.params.name}:`, error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los libros de la etiqueta',
        error: (error as Error).message
      });
    }
  }
};
