import express from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

// Routes publiques
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Routes protégées
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;