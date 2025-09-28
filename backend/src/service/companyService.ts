import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyService {
  static async createCompany(data: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    const company = await prisma.company.create({
      data
    });

    return company;
  }

  static async getAllCompanies() {
    const companies = await prisma.company.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isActive: true
          }
        },
        payRuns: {
          select: {
            id: true,
            period: true,
            status: true
          }
        }
      }
    });

    return companies;
  }

  static async getCompanyById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        employees: true,
        payRuns: true
      }
    });

    if (!company) {
      throw new Error('Entreprise non trouvée');
    }

    return company;
  }

  static async updateCompany(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    const company = await prisma.company.update({
      where: { id },
      data
    });

    return company;
  }

  static async deleteCompany(id: string) {
    // Vérifier qu'il n'y a pas d'employés actifs
    const activeEmployees = await prisma.employee.count({
      where: {
        companyId: id,
        isActive: true
      }
    });

    if (activeEmployees > 0) {
      throw new Error('Impossible de supprimer une entreprise avec des employés actifs');
    }

    await prisma.company.delete({
      where: { id }
    });

    return { message: 'Entreprise supprimée avec succès' };
  }

  static async getCompanyStats(companyId: string) {
    const [employeeCount, totalSalary, payRunsCount] = await Promise.all([
      prisma.employee.count({
        where: { companyId, isActive: true }
      }),
      prisma.employee.aggregate({
        where: { companyId, isActive: true },
        _sum: { rate: true }
      }),
      prisma.payRun.count({
        where: { companyId }
      })
    ]);

    return {
      employeeCount,
      totalSalary: totalSalary._sum.rate || 0,
      payRunsCount
    };
  }
}