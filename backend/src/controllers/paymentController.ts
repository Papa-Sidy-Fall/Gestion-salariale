import { Request, Response } from 'express';
import { PaymentService } from '../service/paymentService';
import { AuthRequest } from '../middleware/auth';

export class PaymentController {
  static async createPayment(req: AuthRequest, res: Response) {
    try {
      const paymentData = req.body;
      const payment = await PaymentService.createPayment(paymentData);

      res.status(201).json({
        message: 'Paiement enregistré avec succès',
        payment
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentsByPayslip(req: AuthRequest, res: Response) {
    try {
      const { payslipId } = req.params;
      if (!payslipId) {
        return res.status(400).json({ error: 'ID bulletin requis' });
      }

      const payments = await PaymentService.getPaymentsByPayslip(payslipId);

      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentsByCompany(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }

      const payments = await PaymentService.getPaymentsByCompany(companyId);

      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPayments(req: AuthRequest, res: Response) {
    try {
      const payments = await PaymentService.getAllPayments();

      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePayment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID paiement requis' });
      }

      const result = await PaymentService.deletePayment(id);

      res.json(result);
    } catch (error: any) {
      if (error.message.includes('Impossible de supprimer')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getPaymentStats(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.query;
      const stats = await PaymentService.getPaymentStats(companyId as string);

      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}