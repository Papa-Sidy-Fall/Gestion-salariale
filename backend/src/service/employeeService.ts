import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EmployeeService {
  static async createEmployee(data: {
    firstName: string;
    lastName: string;
    position: string;
    contractType: any;
    rate: number;
    bankDetails?: string;
    companyId: string;
  }) {
    const employee = await prisma.employee.create({
      data: {
        ...data,
        isActive: true
      },
      include: {
        company: true
      }
    });

    return employee;
  }

  static async getAllEmployees(companyId?: string) {
    const where = companyId ? { companyId, isActive: true } : { isActive: true };

    const employees = await prisma.employee.findMany({
      where,
      include: {
        company: true,
        payslips: {
          include: {
            payRun: true,
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return employees;
  }

  static async getEmployeeById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        company: true,
        payslips: {
          include: {
            payRun: true,
            payments: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!employee) {
      throw new Error('Employé non trouvé');
    }

    return employee;
  }

  static async updateEmployee(id: string, data: any) {
    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        company: true
      }
    });

    return employee;
  }

  static async toggleEmployeeStatus(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      throw new Error('Employé non trouvé');
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        isActive: !employee.isActive
      },
      include: {
        company: true
      }
    });

    return updatedEmployee;
  }

  static async deleteEmployee(id: string) {
    // Vérifier s'il y a des bulletins non payés
    const unpaidPayslips = await prisma.payslip.count({
      where: {
        employeeId: id,
        status: { in: ['EN_ATTENTE', 'PARTIEL'] }
      }
    });

    if (unpaidPayslips > 0) {
      throw new Error('Impossible de supprimer un employé avec des bulletins impayés');
    }

    // Désactiver au lieu de supprimer
    const employee = await prisma.employee.update({
      where: { id },
      data: { isActive: false },
      include: {
        company: true
      }
    });

    return employee;
  }

  static async getEmployeesByCompany(companyId: string) {
    const employees = await prisma.employee.findMany({
      where: {
        companyId,
        isActive: true
      },
      include: {
        payslips: {
          include: {
            payRun: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return employees;
  }

  static async getEmployeeStats(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        payslips: {
          include: {
            payments: true
          }
        }
      }
    });

    if (!employee) {
      throw new Error('Employé non trouvé');
    }

    const totalPayslips = employee.payslips.length;
    const totalPaid = employee.payslips.reduce((sum: number, payslip: any) => {
      return sum + payslip.payments.reduce((paymentSum: number, payment: any) => paymentSum + payment.amount, 0);
    }, 0);
    const totalOwed = employee.payslips.reduce((sum: number, payslip: any) => sum + payslip.net, 0) - totalPaid;

    return {
      totalPayslips,
      totalPaid,
      totalOwed,
      lastPayslip: employee.payslips[0] || null
    };
  }

  static async filterEmployees(filters: {
    companyId?: string;
    contractType?: string;
    position?: string;
    isActive?: boolean;
  }) {
    const where: any = {};

    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.contractType) where.contractType = filters.contractType;
    if (filters.position) where.position = filters.position;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const employees = await prisma.employee.findMany({
      where,
      include: {
        company: true,
        payslips: {
          include: {
            payRun: true,
            payments: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return employees;
  }
}