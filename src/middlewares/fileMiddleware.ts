import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config';

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determinar la carpeta de destino según el tipo de archivo
    let destinationPath = config.booksPath;
    
    // Crear la carpeta si no existe
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Conservar el nombre original del archivo
    cb(null, file.originalname);
  }
});

// Filtro para archivos aceptados
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Verificar la extensión del archivo
  const allowedExts = ['.epub'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no soportado. Solo se permiten: ${allowedExts.join(', ')}`));
  }
};

// Configuración de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // Límite de 100MB
  }
});

// Middleware para manejar errores de multer
export const multerErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Error específico de multer
    let message = 'Error al cargar el archivo';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'El archivo excede el tamaño máximo permitido';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Archivo no esperado';
        break;
      default:
        message = `Error de Multer: ${err.message}`;
    }
    
    return res.status(400).json({
      success: false,
      message
    });
  } else if (err) {
    // Otro tipo de error
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

export default {
  upload,
  multerErrorHandler
};
