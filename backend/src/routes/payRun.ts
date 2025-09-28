import express from 'express';
import { PayRunController } from '../controllers/payRunController';
import { authenticateToken, authorizeRoles, authorizeCompanyAccess } from '../middleware/auth';

const router = express.Router();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

// Routes pour créer et gérer les cycles de paie
router.post('/', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.createPayRun);
router.get('/', authenticateToken, PayRunController.getAllPayRuns);

// Routes spécifiques aux cycles
router.get('/:id', authenticateToken, PayRunController.getPayRunById);
router.put('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.updatePayRun);
router.delete('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.deletePayRun);

// Actions sur les cycles
router.post('/:id/generate-payslips', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.generatePayslips);
router.post('/:id/approve', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.approvePayRun);
router.post('/:id/close', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), PayRunController.closePayRun);

// Routes par entreprise
router.get('/company/:companyId', authenticateToken, authorizeCompanyAccess, PayRunController.getPayRunsByCompany);

export default router;