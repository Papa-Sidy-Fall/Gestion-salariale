"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const companyService_1 = require("../service/companyService");
class CompanyController {
    static async createCompany(req, res) {
        try {
            const companyData = req.body;
            const company = await companyService_1.CompanyService.createCompany(companyData);
            res.status(201).json({
                message: 'Entreprise créée avec succès',
                company
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAllCompanies(req, res) {
        try {
            const companies = await companyService_1.CompanyService.getAllCompanies();
            res.json({ companies });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getCompanyById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const company = await companyService_1.CompanyService.getCompanyById(id);
            res.json({ company });
        }
        catch (error) {
            if (error.message === 'Entreprise non trouvée') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async updateCompany(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const updateData = req.body;
            const company = await companyService_1.CompanyService.updateCompany(id, updateData);
            res.json({
                message: 'Entreprise mise à jour avec succès',
                company
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteCompany(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const result = await companyService_1.CompanyService.deleteCompany(id);
            res.json(result);
        }
        catch (error) {
            if (error.message.includes('Impossible de supprimer')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async getCompanyStats(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const stats = await companyService_1.CompanyService.getCompanyStats(companyId);
            res.json({ stats });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=companyController.js.map