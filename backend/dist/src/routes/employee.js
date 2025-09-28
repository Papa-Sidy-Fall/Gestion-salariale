"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
// Routes pour créer et lister tous les employés (Super Admin uniquement)
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), employeeController_1.EmployeeController.createEmployee);
router.get('/', auth_1.authenticateToken, employeeController_1.EmployeeController.getAllEmployees);
// Routes pour les employés spécifiques
router.get('/:id', auth_1.authenticateToken, employeeController_1.EmployeeController.getEmployeeById);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), employeeController_1.EmployeeController.updateEmployee);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN, UserRole.ADMIN), employeeController_1.EmployeeController.deleteEmployee);
// Routes pour les statistiques et filtrage
router.get('/:id/stats', auth_1.authenticateToken, employeeController_1.EmployeeController.getEmployeeStats);
router.get('/company/:companyId', auth_1.authenticateToken, auth_1.authorizeCompanyAccess, employeeController_1.EmployeeController.getEmployeesByCompany);
router.get('/filter/search', auth_1.authenticateToken, employeeController_1.EmployeeController.filterEmployees);
exports.default = router;
//# sourceMappingURL=employee.js.map