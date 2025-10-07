import { Request, Response } from 'express';
import { PayRunService } from '../service/payRunService';
import { AuthRequest } from '../middleware/auth';

export class PayRunController {
  static async createPayRun(req: AuthRequest, res: Response) {
    try {
      const { period, companyId, fixedEmployeePaymentOption } = req.body;

      const payRunData = {
        period,
        companyId: req.user?.role === 'SUPER_ADMIN' ? companyId : req.user?.companyId,
        fixedEmployeePaymentOption: fixedEmployeePaymentOption || 'FULL_MONTH' // Option par défaut
      };

      const payRun = await PayRunService.createPayRun(payRunData);

      res.status(201).json({
        message: 'Cycle de paie créé avec succès',
        payRun
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPayRuns(req: AuthRequest, res: Response) {
    try {
      let filterCompanyId = req.query.companyId as string;

      // Vérifier les permissions : Super admin peut voir partout, autres rôles seulement leur entreprise
      if (req.user?.role !== 'SUPER_ADMIN') {
        filterCompanyId = req.user?.companyId || '';
        if (!filterCompanyId) {
          return res.status(403).json({ error: 'Accès non autorisé - entreprise non trouvée' });
        }
      }

      const payRuns = await PayRunService.getAllPayRuns(filterCompanyId);

      res.json({ payRuns });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPayRunById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const payRun = await PayRunService.getPayRunById(id);

      res.json({ payRun });
    } catch (error: any) {
      if (error.message === 'Cycle de paie non trouvé') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePayRun(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const { fixedEmployeePaymentOption, ...updateData } = req.body;

      const dataToUpdate: any = { ...updateData };
      if (fixedEmployeePaymentOption) {
        dataToUpdate.fixedEmployeePaymentOption = fixedEmployeePaymentOption;
      }

      const payRun = await PayRunService.updatePayRun(id, dataToUpdate);

      res.json({
        message: 'Cycle de paie mis à jour avec succès',
        payRun
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePayRun(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const result = await PayRunService.deletePayRun(id);

      res.json(result);
    } catch (error: any) {
      if (error.message.includes('Impossible de supprimer')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async generatePayslips(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const payslips = await PayRunService.generatePayslips(id);

      res.json({
        message: `${payslips.length} bulletins générés avec succès`,
        payslips
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async approvePayRun(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const payRun = await PayRunService.approvePayRun(id);

      res.json({
        message: 'Cycle de paie approuvé avec succès',
        payRun
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async closePayRun(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID cycle de paie requis' });
      }

      const payRun = await PayRunService.closePayRun(id);

      res.json({
        message: 'Cycle de paie clôturé avec succès',
        payRun
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPayRunsByCompany(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }

      const payRuns = await PayRunService.getPayRunsByCompany(companyId);

      res.json({ payRuns });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async payJournalierEmployee(req: AuthRequest, res: Response) {
    try {
      const { employeeId } = req.params;
      if (!employeeId) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const companyId = req.user?.role === 'SUPER_ADMIN' ? req.body.companyId : req.user?.companyId;
      if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }

      const result = await PayRunService.payJournalierEmployee(employeeId, companyId);

      res.json({
        message: 'Paiement journalier effectué avec succès',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
