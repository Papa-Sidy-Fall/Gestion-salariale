import { Request, Response } from 'express';
import { EmployeeService } from '../service/employeeService';
import { AuthRequest } from '../middleware/auth';

export class EmployeeController {
  static async createEmployee(req: AuthRequest, res: Response) {
    try {
      console.log('Données reçues:', req.body);
      console.log('Utilisateur:', req.user);

      const { companyId } = req.body;

      // Vérifier les permissions : Super admin peut créer partout, Admin seulement dans son entreprise
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.companyId !== companyId) {
        return res.status(403).json({ error: 'Accès non autorisé à cette entreprise' });
      }

      const employeeData = {
        ...req.body,
        companyId: req.user?.role === 'SUPER_ADMIN' ? req.body.companyId : req.user?.companyId
      };

      console.log('Données à créer:', employeeData);

      const employee = await EmployeeService.createEmployee(employeeData);

      res.status(201).json({
        message: 'Employé créé avec succès',
        employee
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllEmployees(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.query;
      const employees = await EmployeeService.getAllEmployees(companyId as string);

      res.json({ employees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const employee = await EmployeeService.getEmployeeById(id);

      res.json({ employee });
    } catch (error: any) {
      if (error.message === 'Employé non trouvé') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEmployee(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const updateData = req.body;
      const employee = await EmployeeService.updateEmployee(id, updateData);

      res.json({
        message: 'Employé mis à jour avec succès',
        employee
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async toggleEmployeeStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const employee = await EmployeeService.toggleEmployeeStatus(id);

      res.json({
        message: 'Statut de l\'employé modifié avec succès',
        employee
      });
    } catch (error: any) {
      if (error.message === 'Employé non trouvé') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteEmployee(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const employee = await EmployeeService.deleteEmployee(id);

      res.json({
        message: 'Employé désactivé avec succès',
        employee
      });
    } catch (error: any) {
      if (error.message.includes('Impossible de supprimer')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByCompany(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }

      const employees = await EmployeeService.getEmployeesByCompany(companyId);

      res.json({ employees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeeStats(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const stats = await EmployeeService.getEmployeeStats(id);

      res.json({ stats });
    } catch (error: any) {
      if (error.message === 'Employé non trouvé') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async filterEmployees(req: AuthRequest, res: Response) {
    try {
      const filters = req.query;
      const employees = await EmployeeService.filterEmployees({
        companyId: req.user?.companyId || filters.companyId as string,
        contractType: filters.contractType as string,
        position: filters.position as string,
        isActive: filters.isActive ? filters.isActive === 'true' : undefined
      });

      res.json({ employees });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}