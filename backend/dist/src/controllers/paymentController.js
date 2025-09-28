"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentService_1 = require("../service/paymentService");
class PaymentController {
    static async createPayment(req, res) {
        try {
            const paymentData = req.body;
            const payment = await paymentService_1.PaymentService.createPayment(paymentData);
            res.status(201).json({
                message: 'Paiement enregistré avec succès',
                payment
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getPaymentsByPayslip(req, res) {
        try {
            const { payslipId } = req.params;
            if (!payslipId) {
                return res.status(400).json({ error: 'ID bulletin requis' });
            }
            const payments = await paymentService_1.PaymentService.getPaymentsByPayslip(payslipId);
            res.json({ payments });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getPaymentsByCompany(req, res) {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            const payments = await paymentService_1.PaymentService.getPaymentsByCompany(companyId);
            res.json({ payments });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getAllPayments(req, res) {
        try {
            const payments = await paymentService_1.PaymentService.getAllPayments();
            res.json({ payments });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deletePayment(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID paiement requis' });
            }
            const result = await paymentService_1.PaymentService.deletePayment(id);
            res.json(result);
        }
        catch (error) {
            if (error.message.includes('Impossible de supprimer')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async getPaymentStats(req, res) {
        try {
            const { companyId } = req.query;
            const stats = await paymentService_1.PaymentService.getPaymentStats(companyId);
            res.json({ stats });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map