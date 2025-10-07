"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payRunController_1 = require("../controllers/payRunController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
// Routes pour créer et gérer les cycles de paie
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.createPayRun);
router.get('/', auth_1.authenticateToken, payRunController_1.PayRunController.getAllPayRuns);
// Routes spécifiques aux cycles
router.get('/:id', auth_1.authenticateToken, payRunController_1.PayRunController.getPayRunById);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.updatePayRun);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.deletePayRun);
// Actions sur les cycles
router.post('/:id/generate-payslips', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.generatePayslips);
router.post('/:id/approve', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.approvePayRun);
router.post('/:id/close', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), payRunController_1.PayRunController.closePayRun);
// Routes par entreprise
router.get('/company/:companyId', auth_1.authenticateToken, auth_1.authorizeCompanyAccess, payRunController_1.PayRunController.getPayRunsByCompany);
// Paiement journalier immédiat
router.post('/pay-journalier/:employeeId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.CAISSIER), payRunController_1.PayRunController.payJournalierEmployee);
exports.default = router;
//# sourceMappingURL=payRun.js.map