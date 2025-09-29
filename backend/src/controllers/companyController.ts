import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { CompanyService } from '../service/companyService';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class CompanyController {
  static async createCompany(req: AuthRequest, res: Response) {
    try {
      const { name, address, phone, email, adminEmail, adminPassword } = req.body;

      // Créer l'entreprise
      const company = await CompanyService.createCompany({
        name,
        address,
        phone,
        email
      });

      // Créer automatiquement un compte Admin pour cette entreprise
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllCompanies(req: AuthRequest, res: Response) {
    try {
      const companies = await CompanyService.getAllCompanies();

      res.json({ companies });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCompanyById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }
      const company = await CompanyService.getCompanyById(id);

      res.json({ company });
    } catch (error: any) {
      if (error.message === 'Entreprise non trouvée') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCompany(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }
      const updateData = req.body;
      const company = await CompanyService.updateCompany(id, updateData);

      res.json({
        message: 'Entreprise mise à jour avec succès',
        company
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCompany(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }
      const result = await CompanyService.deleteCompany(id);

      res.json(result);
    } catch (error: any) {
      if (error.message.includes('Impossible de supprimer')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getCompanyStats(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }
      const stats = await CompanyService.getCompanyStats(companyId);

      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}