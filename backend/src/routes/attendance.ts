import express from 'express';
import { AttendanceController } from '../controllers/attendanceController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Routes pour tous les utilisateurs authentifiés
router.post('/', authenticateToken, AttendanceController.createAttendance);
router.get('/', authenticateToken, AttendanceController.getAllAttendances);
router.get('/stats', authenticateToken, AttendanceController.getAttendanceStats);
router.get('/period', authenticateToken, AttendanceController.getAttendancesByPeriod);
router.get('/calculate-salary', authenticateToken, AttendanceController.calculateSalary);
router.get('/:id', authenticateToken, AttendanceController.getAttendanceById);
router.put('/:id', authenticateToken, authorizeRoles('SUPER_ADMIN', 'ADMIN'), AttendanceController.updateAttendance);
router.delete('/:id', authenticateToken, authorizeRoles('SUPER_ADMIN', 'ADMIN'), AttendanceController.deleteAttendance);

// Routes spécifiques pour check-in/check-out
router.post('/check-in', authenticateToken, AttendanceController.checkIn);
router.post('/check-out', authenticateToken, AttendanceController.checkOut);

// Routes pour les pointages d'un employé
router.get('/employee/:employeeId', authenticateToken, AttendanceController.getAttendancesByEmployee);

export default router;
