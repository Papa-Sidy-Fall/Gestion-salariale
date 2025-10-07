"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunController = void 0;
const payRunService_1 = require("../service/payRunService");
class PayRunController {
    static async createPayRun(req, res) {
        var _a, _b;
        try {
            const { period, companyId, fixedEmployeePaymentOption } = req.body;
            const payRunData = {
                period,
                companyId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'SUPER_ADMIN' ? companyId : (_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId,
                fixedEmployeePaymentOption: fixedEmployeePaymentOption || 'FULL_MONTH' // Option par défaut
            };
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
        var _a, _b;
        try {
            let filterCompanyId = req.query.companyId;
            // Vérifier les permissions : Super admin peut voir partout, autres rôles seulement leur entreprise
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
                filterCompanyId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) || '';
                if (!filterCompanyId) {
                    return res.status(403).json({ error: 'Accès non autorisé - entreprise non trouvée' });
                }
            }
            const payRuns = await payRunService_1.PayRunService.getAllPayRuns(filterCompanyId);
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
            const _a = req.body, { fixedEmployeePaymentOption } = _a, updateData = __rest(_a, ["fixedEmployeePaymentOption"]);
            const dataToUpdate = Object.assign({}, updateData);
            if (fixedEmployeePaymentOption) {
                dataToUpdate.fixedEmployeePaymentOption = fixedEmployeePaymentOption;
            }
            const payRun = await payRunService_1.PayRunService.updatePayRun(id, dataToUpdate);
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
    static async payJournalierEmployee(req, res) {
        var _a, _b;
        try {
            const { employeeId } = req.params;
            if (!employeeId) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const companyId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'SUPER_ADMIN' ? req.body.companyId : (_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId;
            if (!companyId) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const result = await payRunService_1.PayRunService.payJournalierEmployee(employeeId, companyId);
            res.json({
                message: 'Paiement journalier effectué avec succès',
                result
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PayRunController = PayRunController;
//# sourceMappingURL=payRunController.js.map