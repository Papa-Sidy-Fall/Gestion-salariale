"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes pour tous les utilisateurs authentifiés
router.post('/', auth_1.authenticateToken, attendanceController_1.AttendanceController.createAttendance);
router.get('/', auth_1.authenticateToken, attendanceController_1.AttendanceController.getAllAttendances);
router.get('/today', auth_1.authenticateToken, attendanceController_1.AttendanceController.getTodayAttendance);
router.get('/stats', auth_1.authenticateToken, attendanceController_1.AttendanceController.getAttendanceStats);
router.get('/period', auth_1.authenticateToken, attendanceController_1.AttendanceController.getAttendancesByPeriod);
router.get('/calculate-salary', auth_1.authenticateToken, attendanceController_1.AttendanceController.calculateSalary);
router.get('/:id', auth_1.authenticateToken, attendanceController_1.AttendanceController.getAttendanceById);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('SUPER_ADMIN', 'ADMIN'), attendanceController_1.AttendanceController.updateAttendance);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('SUPER_ADMIN', 'ADMIN'), attendanceController_1.AttendanceController.deleteAttendance);
// Routes spécifiques pour check-in/check-out
router.post('/check-in', auth_1.authenticateToken, attendanceController_1.AttendanceController.checkIn);
router.post('/check-out', auth_1.authenticateToken, attendanceController_1.AttendanceController.checkOut);
// Route pour la saisie manuelle des heures par le caissier
router.post('/manual-entry', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('SUPER_ADMIN', 'CAISSIER'), attendanceController_1.AttendanceController.manualTimeEntry);
// Routes pour les pointages d'un employé
router.get('/employee/:employeeId', auth_1.authenticateToken, attendanceController_1.AttendanceController.getAttendancesByEmployee);
exports.default = router;
//# sourceMappingURL=attendance.js.map