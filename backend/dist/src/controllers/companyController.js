"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const companyService_1 = require("../service/companyService");
const prisma = new client_1.PrismaClient();
class CompanyController {
    static async createCompany(req, res) {
        try {
            const { name, address, phone, email, adminEmail, adminPassword } = req.body;
            // Créer l'entreprise
            const company = await companyService_1.CompanyService.createCompany({
                name,
                address,
                phone,
                email
            });
            // Créer automatiquement un compte Admin pour cette entreprise
            const hashedPassword = await bcrypt_1.default.hash(adminPassword, 10);
            const admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    companyId: company.id
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    companyId: true,
                    createdAt: true
                }
            });
            res.status(201).json({
                message: 'Entreprise et compte Admin créés avec succès',
                company,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
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