import { Router, Request } from 'express';
import bookRoutes from './bookRoutes';
import authorRoutes from './authorRoutes';
import tagRoutes from './tagRoutes';
import searchRoutes from './searchRoutes';
import filterRoutes from './filterRoutes';
import { BookController } from '../controllers';

// Extender la interfaz Request para añadir el parámetro filepath
interface BookFileRequest extends Request {
  params: {
    id: string;
    filename: string;
    filepath?: string;
  }
}

const router = Router();

// Montar las rutas
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/tags', tagRoutes);
router.use('/search', searchRoutes);
router.use('/books', filterRoutes); // Para filtros como /books/author/:name

// Ruta para obtener archivos
router.get('/file/:id/:filename', (req, res) => {
  const bookReq = req as BookFileRequest;
  bookReq.params.filepath = `${bookReq.params.id}/${bookReq.params.filename}`;
  BookController.getBookFile(bookReq, res);
});

export default router;
