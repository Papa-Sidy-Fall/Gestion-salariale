"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const employeeService_1 = require("../service/employeeService");
class EmployeeController {
    static async createEmployee(req, res) {
        var _a, _b, _c, _d;
        try {
            console.log('Données reçues:', req.body);
            console.log('Utilisateur:', req.user);
            const { companyId } = req.body;
            // Vérifier les permissions : Super admin peut créer partout, Admin seulement dans son entreprise
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) !== companyId) {
                return res.status(403).json({ error: 'Accès non autorisé à cette entreprise' });
            }
            const employeeData = Object.assign(Object.assign({}, req.body), { companyId: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) === 'SUPER_ADMIN' ? req.body.companyId : (_d = req.user) === null || _d === void 0 ? void 0 : _d.companyId });
            console.log('Données à créer:', employeeData);
            const employee = await employeeService_1.EmployeeService.createEmployee(employeeData);
            res.status(201).json({
                message: 'Employé créé avec succès',
                employee
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAllEmployees(req, res) {
        try {
            const { companyId } = req.query;
            const employees = await employeeService_1.EmployeeService.getAllEmployees(companyId);
            res.json({ employees });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const employee = await employeeService_1.EmployeeService.getEmployeeById(id);
            res.json({ employee });
        }
        catch (error) {
            if (error.message === 'Employé non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const updateData = req.body;
            const employee = await employeeService_1.EmployeeService.updateEmployee(id, updateData);
            res.json({
                message: 'Employé mis à jour avec succès',
                employee
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async toggleEmployeeStatus(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const employee = await employeeService_1.EmployeeService.toggleEmployeeStatus(id);
            res.json({
                message: 'Statut de l\'employé modifié avec succès',
                employee
            });
        }
        catch (error) {
            if (error.message === 'Employé non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const employee = await employeeService_1.EmployeeService.deleteEmployee(id);
            res.json({
                message: 'Employé désactivé avec succès',
                employee
            });
        }
        catch (error) {
            if (error.message.includes('Impossible de supprimer')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async getEmployeesByCompany(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const employees = await employeeService_1.EmployeeService.getEmployeesByCompany(companyId);
            res.json({ employees });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getEmployeeStats(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const stats = await employeeService_1.EmployeeService.getEmployeeStats(id);
            res.json({ stats });
        }
        catch (error) {
            if (error.message === 'Employé non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async filterEmployees(req, res) {
        var _a;
        try {
            const filters = req.query;
            const employees = await employeeService_1.EmployeeService.filterEmployees({
                companyId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId) || filters.companyId,
                contractType: filters.contractType,
                position: filters.position,
                isActive: filters.isActive ? filters.isActive === 'true' : undefined
            });
            res.json({ employees });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employeeController.js.map