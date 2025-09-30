import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

// Routes pour créer et gérer les paiements
router.post('/', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CAISSIER), PaymentController.createPayment);
router.get('/', authenticateToken, PaymentController.getAllPayments);

// Routes spécifiques aux paiements
router.get('/payslip/:payslipId', authenticateToken, PaymentController.getPaymentsByPayslip);
router.get('/company/:companyId', authenticateToken, PaymentController.getPaymentsByCompany);
router.delete('/:id', authenticateToken, authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CAISSIER), PaymentController.deletePayment);

// Statistiques
router.get('/stats', authenticateToken, PaymentController.getPaymentStats);

// Génération de factures PDF (accessible aux caissiers et admins)
router.get('/:paymentId/invoice', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.CAISSIER), PaymentController.generateInvoicePDF);

export default router;