import { Request, Response } from 'express';
import { PaymentService } from '../service/paymentService';
import { PDFService } from '../service/pdfService';
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

  static async generateInvoicePDF(req: AuthRequest, res: Response) {
    try {
      const { paymentId } = req.params;
      if (!paymentId) {
        return res.status(400).json({ error: 'ID paiement requis' });
      }

      // Récupérer les données du paiement avec toutes les relations nécessaires
      const payment = await PaymentService.getPaymentById(paymentId);
      if (!payment) {
        return res.status(404).json({ error: 'Paiement non trouvé' });
      }

      // Générer le PDF avec les informations du caissier
      const pdfBuffer = await PDFService.generateInvoicePDF({
        payment,
        payslip: payment.payslip,
        employee: payment.payslip.employee,
        company: payment.payslip.employee.company,
        cashier: req.user // Informations du caissier connecté
      });

      // Définir les headers pour le téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=facture-${payment.id.slice(-8)}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // Envoyer le PDF
      res.send(pdfBuffer);
    } catch (error: any) {
      console.error('Erreur lors de la génération du PDF:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
    }
  }
}