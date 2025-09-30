import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/logos/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `logo-${uniqueSuffix}${extension}`);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

// Configuration multer
export const uploadLogo = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});