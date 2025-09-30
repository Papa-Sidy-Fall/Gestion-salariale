"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EmployeeService {
    static async createEmployee(data) {
        const employee = await prisma.employee.create({
            data: Object.assign(Object.assign({}, data), { isActive: true }),
            include: {
                company: true
            }
        });
        return employee;
    }
    static async getAllEmployees(companyId) {
        const where = companyId ? { companyId } : {};
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
    static async getEmployeeById(id) {
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
    static async updateEmployee(id, data) {
        const employee = await prisma.employee.update({
            where: { id },
            data,
            include: {
                company: true
            }
        });
        return employee;
    }
    static async toggleEmployeeStatus(id) {
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
    static async deleteEmployee(id) {
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
    static async getEmployeesByCompany(companyId) {
        const employees = await prisma.employee.findMany({
            where: {
                companyId
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
    static async getEmployeeStats(employeeId) {
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
        const totalPaid = employee.payslips.reduce((sum, payslip) => {
            return sum + payslip.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
        }, 0);
        const totalOwed = employee.payslips.reduce((sum, payslip) => sum + payslip.net, 0) - totalPaid;
        return {
            totalPayslips,
            totalPaid,
            totalOwed,
            lastPayslip: employee.payslips[0] || null
        };
    }
    static async filterEmployees(filters) {
        const where = {};
        if (filters.companyId)
            where.companyId = filters.companyId;
        if (filters.contractType)
            where.contractType = filters.contractType;
        if (filters.position)
            where.position = filters.position;
        if (filters.isActive !== undefined)
            where.isActive = filters.isActive;
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
exports.EmployeeService = EmployeeService;
//# sourceMappingURL=employeeService.js.map