import express from 'express';
import { CompanyController } from '../controllers/companyController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { uploadLogo } from '../middleware/upload';

const router = express.Router();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

// Routes pour super admin uniquement
router.post('/', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), CompanyController.createCompany);
router.get('/', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), CompanyController.getAllCompanies);
router.delete('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), CompanyController.deleteCompany);

// Routes pour tous les utilisateurs authentifiés
router.get('/:id', authenticateToken, CompanyController.getCompanyById);
router.put('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), CompanyController.updateCompany);
router.get('/:companyId/stats', authenticateToken, CompanyController.getCompanyStats);

// Routes pour logo et couleur (Super Admin uniquement)
router.put('/:companyId/logo', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), uploadLogo.single('logo'), CompanyController.uploadLogo);
router.put('/:companyId/color', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN), CompanyController.updateCompanyColor);

export default router;