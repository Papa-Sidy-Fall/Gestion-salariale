import { Request, Response } from 'express';
import { AuthService } from '../service/authService';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CAISSIER = 'CAISSIER',
  EMPLOYEE = 'EMPLOYEE'
}

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const { email, password, role, companyId } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, mot de passe et rôle requis' });
      }

      // Validation du rôle
      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      // Seuls les super admin peuvent créer des comptes super admin
      if (role === UserRole.SUPER_ADMIN && (!req.user || req.user.role !== UserRole.SUPER_ADMIN)) {
        return res.status(403).json({ error: 'Seul un super admin peut créer un compte super admin' });
      }

      // Pour les rôles ADMIN et CAISSIER, un companyId est requis
      if ((role === UserRole.ADMIN || role === UserRole.CAISSIER) && !companyId) {
        return res.status(400).json({ error: 'ID entreprise requis pour ce rôle' });
      }

      // Vérifier les permissions : Super admin peut créer partout, Admin seulement dans son entreprise
      if (req.user?.role !== UserRole.SUPER_ADMIN && req.user?.companyId !== companyId) {
        return res.status(403).json({ error: 'Accès non autorisé à cette entreprise' });
      }

      const user = await AuthService.register(email, password, role, companyId);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const result = await AuthService.login(email, password);

      res.json({
        message: 'Connexion réussie',
        ...result
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Non authentifié' });
      }

      const user = await AuthService.getUserById(req.user.id);

      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsersByCompany(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.query;

      if (!companyId || typeof companyId !== 'string') {
        return res.status(400).json({ error: 'ID entreprise requis' });
      }

      // Vérifier que l'utilisateur a accès à cette entreprise
      // Super admin peut voir tous, Admin peut voir son entreprise
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.companyId !== companyId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const users = await prisma.user.findMany({
        where: { companyId },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      res.json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}