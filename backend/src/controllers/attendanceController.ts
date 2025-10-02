import { Response } from 'express';
import { AttendanceService } from '../service/attendanceService';
import { AuthRequest } from '../middleware/auth';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceController {
  // Créer un pointage
  static async createAttendance(req: AuthRequest, res: Response) {
    try {
      const { employeeId, date, checkIn, checkOut, status, notes } = req.body;

      if (!employeeId || !date) {
        return res.status(400).json({ error: 'ID employé et date requis' });
      }

      const attendance = await AttendanceService.createAttendance({
        employeeId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status: status || AttendanceStatus.PRESENT,
        notes,
      });

      res.status(201).json({
        message: 'Pointage créé avec succès',
        attendance,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Pointer l'arrivée
  static async checkIn(req: AuthRequest, res: Response) {
    try {
      const { employeeId, date } = req.body;

      if (!employeeId) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const attendance = await AttendanceService.checkIn(
        employeeId,
        date ? new Date(date) : undefined
      );

      res.json({
        message: 'Arrivée pointée avec succès',
        attendance,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Pointer le départ
  static async checkOut(req: AuthRequest, res: Response) {
    try {
      const { employeeId, date } = req.body;

      if (!employeeId) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const attendance = await AttendanceService.checkOut(
        employeeId,
        date ? new Date(date) : undefined
      );

      res.json({
        message: 'Départ pointé avec succès',
        attendance,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir tous les pointages
  static async getAllAttendances(req: AuthRequest, res: Response) {
    try {
      const { employeeId, startDate, endDate, status, companyId } = req.query;

      // Vérifier les permissions
      let filterCompanyId = companyId as string;
      if (req.user?.role !== 'SUPER_ADMIN') {
        filterCompanyId = req.user?.companyId || '';
      }

      const attendances = await AttendanceService.getAllAttendances({
        employeeId: employeeId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        status: status as AttendanceStatus,
        companyId: filterCompanyId,
      });

      res.json({ attendances });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir un pointage par ID
  static async getAttendanceById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID pointage requis' });
      }

      const attendance = await AttendanceService.getAttendanceById(id);

      res.json({ attendance });
    } catch (error: any) {
      if (error.message === 'Pointage non trouvé') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir les pointages d'un employé
  static async getAttendancesByEmployee(req: AuthRequest, res: Response) {
    try {
      const { employeeId } = req.params;
      const { period } = req.query;

      if (!employeeId) {
        return res.status(400).json({ error: 'ID employé requis' });
      }

      const attendances = await AttendanceService.getAttendancesByEmployee(
        employeeId,
        period as string
      );

      res.json({ attendances });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir les pointages par période
  static async getAttendancesByPeriod(req: AuthRequest, res: Response) {
    try {
      const { period, companyId } = req.query;

      if (!period) {
        return res.status(400).json({ error: 'Période requise (format: YYYY-MM)' });
      }

      // Vérifier les permissions
      let filterCompanyId = companyId as string;
      if (req.user?.role !== 'SUPER_ADMIN') {
        filterCompanyId = req.user?.companyId || '';
      }

      const attendances = await AttendanceService.getAttendancesByPeriod(
        period as string,
        filterCompanyId
      );

      res.json({ attendances });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour un pointage
  static async updateAttendance(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { checkIn, checkOut, status, notes } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID pointage requis' });
      }

      const attendance = await AttendanceService.updateAttendance(id, {
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        status,
        notes,
      });

      res.json({
        message: 'Pointage mis à jour avec succès',
        attendance,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Supprimer un pointage
  static async deleteAttendance(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID pointage requis' });
      }

      const result = await AttendanceService.deleteAttendance(id);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtenir les statistiques de pointage
  static async getAttendanceStats(req: AuthRequest, res: Response) {
    try {
      const { employeeId, companyId, period } = req.query;

      // Vérifier les permissions
      let filterCompanyId = companyId as string;
      if (req.user?.role !== 'SUPER_ADMIN') {
        filterCompanyId = req.user?.companyId || '';
      }

      const stats = await AttendanceService.getAttendanceStats({
        employeeId: employeeId as string,
        companyId: filterCompanyId,
        period: period as string,
      });

      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Calculer le salaire basé sur les pointages
  static async calculateSalary(req: AuthRequest, res: Response) {
    try {
      const { employeeId, period } = req.query;

      if (!employeeId || !period) {
        return res.status(400).json({ error: 'ID employé et période requis' });
      }

      const calculation = await AttendanceService.calculateSalaryFromAttendance(
        employeeId as string,
        period as string
      );

      res.json({ calculation });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
