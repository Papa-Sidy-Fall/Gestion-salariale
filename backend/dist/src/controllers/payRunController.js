"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunController = void 0;
const payRunService_1 = require("../service/payRunService");
class PayRunController {
    static async createPayRun(req, res) {
        var _a, _b;
        try {
            const payRunData = Object.assign(Object.assign({}, req.body), { companyId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'SUPER_ADMIN' ? req.body.companyId : (_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId });
            const payRun = await payRunService_1.PayRunService.createPayRun(payRunData);
            res.status(201).json({
                message: 'Cycle de paie créé avec succès',
                payRun
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAllPayRuns(req, res) {
        try {
            const { companyId } = req.query;
            const payRuns = await payRunService_1.PayRunService.getAllPayRuns(companyId);
            res.json({ payRuns });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getPayRunById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const payRun = await payRunService_1.PayRunService.getPayRunById(id);
            res.json({ payRun });
        }
        catch (error) {
            if (error.message === 'Cycle de paie non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async updatePayRun(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const updateData = req.body;
            const payRun = await payRunService_1.PayRunService.updatePayRun(id, updateData);
            res.json({
                message: 'Cycle de paie mis à jour avec succès',
                payRun
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deletePayRun(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const result = await payRunService_1.PayRunService.deletePayRun(id);
            res.json(result);
        }
        catch (error) {
            if (error.message.includes('Impossible de supprimer')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async generatePayslips(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const payslips = await payRunService_1.PayRunService.generatePayslips(id);
            res.json({
                message: `${payslips.length} bulletins générés avec succès`,
                payslips
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async approvePayRun(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const payRun = await payRunService_1.PayRunService.approvePayRun(id);
            res.json({
                message: 'Cycle de paie approuvé avec succès',
                payRun
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async closePayRun(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID cycle de paie requis' });
            }
            const payRun = await payRunService_1.PayRunService.closePayRun(id);
            res.json({
                message: 'Cycle de paie clôturé avec succès',
                payRun
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getPayRunsByCompany(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const payRuns = await payRunService_1.PayRunService.getPayRunsByCompany(companyId);
            res.json({ payRuns });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PayRunController = PayRunController;
//# sourceMappingURL=payRunController.js.map