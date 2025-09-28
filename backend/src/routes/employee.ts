import express from 'express';
import { EmployeeController } from '../controllers/employeeController';
import { authenticateToken, authorizeRoles, authorizeCompanyAccess } from '../middleware/auth';

const router = express.Router();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

// Routes pour créer et lister tous les employés (Super Admin uniquement)
router.post('/', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), EmployeeController.createEmployee);
router.get('/', authenticateToken, EmployeeController.getAllEmployees);

// Routes pour les employés spécifiques
router.get('/:id', authenticateToken, EmployeeController.getEmployeeById);
router.put('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), EmployeeController.updateEmployee);
router.delete('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN), EmployeeController.deleteEmployee);

// Routes pour les statistiques et filtrage
router.get('/:id/stats', authenticateToken, EmployeeController.getEmployeeStats);
router.get('/company/:companyId', authenticateToken, authorizeCompanyAccess, EmployeeController.getEmployeesByCompany);
router.get('/filter/search', authenticateToken, EmployeeController.filterEmployees);

export default router;