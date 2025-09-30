"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
// Routes pour créer et gérer les paiements
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CAISSIER), paymentController_1.PaymentController.createPayment);
router.get('/', auth_1.authenticateToken, paymentController_1.PaymentController.getAllPayments);
// Routes spécifiques aux paiements
router.get('/payslip/:payslipId', auth_1.authenticateToken, paymentController_1.PaymentController.getPaymentsByPayslip);
router.get('/company/:companyId', auth_1.authenticateToken, paymentController_1.PaymentController.getPaymentsByCompany);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CAISSIER), paymentController_1.PaymentController.deletePayment);
// Statistiques
router.get('/stats', auth_1.authenticateToken, paymentController_1.PaymentController.getPaymentStats);
// Génération de factures PDF (accessible aux caissiers et admins)
router.get('/:paymentId/invoice', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.ADMIN, UserRole.CAISSIER), paymentController_1.PaymentController.generateInvoicePDF);
exports.default = router;
//# sourceMappingURL=payment.js.map