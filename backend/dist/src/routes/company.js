"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyController_1 = require("../controllers/companyController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
// Routes pour super admin uniquement
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), companyController_1.CompanyController.createCompany);
router.get('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), companyController_1.CompanyController.getAllCompanies);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), companyController_1.CompanyController.deleteCompany);
// Routes pour tous les utilisateurs authentifiés
router.get('/:id', auth_1.authenticateToken, companyController_1.CompanyController.getCompanyById);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), companyController_1.CompanyController.updateCompany);
router.get('/:companyId/stats', auth_1.authenticateToken, companyController_1.CompanyController.getCompanyStats);
// Routes pour logo et couleur (Super Admin uniquement)
router.put('/:companyId/logo', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), upload_1.uploadLogo.single('logo'), companyController_1.CompanyController.uploadLogo);
router.put('/:companyId/color', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(UserRole.SUPER_ADMIN), companyController_1.CompanyController.updateCompanyColor);
exports.default = router;
//# sourceMappingURL=company.js.map