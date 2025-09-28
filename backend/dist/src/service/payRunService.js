"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PayRunService {
    static async createPayRun(data) {
        // Vérifier qu'il n'y a pas déjà un cycle pour cette période
        const existingPayRun = await prisma.payRun.findFirst({
            where: {
                companyId: data.companyId,
                period: data.period
            }
        });
        if (existingPayRun) {
            throw new Error('Un cycle de paie existe déjà pour cette période');
        }
        const payRun = await prisma.payRun.create({
            data: Object.assign(Object.assign({}, data), { status: 'BROUILLON' }),
            include: {
                company: true
            }
        });
        return payRun;
    }
    static async getAllPayRuns(companyId) {
        const where = companyId ? { companyId } : {};
        const payRuns = await prisma.payRun.findMany({
            where,
            include: {
                company: true,
                payslips: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                position: true
                            }
                        },
                        payments: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return payRuns;
    }
    static async getPayRunById(id) {
        const payRun = await prisma.payRun.findUnique({
            where: { id },
            include: {
                company: true,
                payslips: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                position: true,
                                contractType: true,
                                rate: true
                            }
                        },
                        payments: true
                    }
                }
            }
        });
        if (!payRun) {
            throw new Error('Cycle de paie non trouvé');
        }
        return payRun;
    }
    static async updatePayRun(id, data) {
        const payRun = await prisma.payRun.update({
            where: { id },
            data,
            include: {
                company: true
            }
        });
        return payRun;
    }
    static async deletePayRun(id) {
        // Vérifier qu'il n'y a pas de bulletins approuvés
        const approvedPayslips = await prisma.payslip.count({
            where: {
                payRunId: id,
                status: { in: ['PAYE', 'PARTIEL'] }
            }
        });
        if (approvedPayslips > 0) {
            throw new Error('Impossible de supprimer un cycle avec des bulletins payés');
        }
        // Supprimer d'abord les bulletins
        await prisma.payslip.deleteMany({
            where: { payRunId: id }
        });
        // Puis supprimer le cycle
        await prisma.payRun.delete({
            where: { id }
        });
        return { message: 'Cycle de paie supprimé avec succès' };
    }
    static async generatePayslips(payRunId) {
        const payRun = await prisma.payRun.findUnique({
            where: { id: payRunId },
            include: {
                company: true,
                payslips: true
            }
        });
        if (!payRun) {
            throw new Error('Cycle de paie non trouvé');
        }
        if (payRun.status !== 'BROUILLON') {
            throw new Error('Impossible de générer des bulletins pour un cycle non en brouillon');
        }
        // Récupérer tous les employés actifs de l'entreprise
        const employees = await prisma.employee.findMany({
            where: {
                companyId: payRun.companyId,
                isActive: true
            }
        });
        const payslips = [];
        for (const employee of employees) {
            // Calculer le salaire brut (pour simplifier, on utilise le taux fixe)
            // Dans un vrai système, il faudrait calculer selon le type de contrat
            let grossSalary = employee.rate;
            // Pour les journaliers, on pourrait demander le nombre de jours
            if (employee.contractType === 'JOURNALIER') {
                // Par défaut, on considère 30 jours travaillés
                grossSalary = employee.rate * 30;
            }
            // Calculer les déductions (simplifié - 5% pour l'exemple)
            const deductions = grossSalary * 0.05;
            const netSalary = grossSalary - deductions;
            const payslip = await prisma.payslip.create({
                data: {
                    employeeId: employee.id,
                    payRunId: payRun.id,
                    gross: grossSalary,
                    deductions: deductions,
                    net: netSalary,
                    status: 'EN_ATTENTE'
                },
                include: {
                    employee: true
                }
            });
            payslips.push(payslip);
        }
        return payslips;
    }
    static async approvePayRun(id) {
        const payRun = await prisma.payRun.findUnique({
            where: { id },
            include: {
                payslips: true
            }
        });
        if (!payRun) {
            throw new Error('Cycle de paie non trouvé');
        }
        if (payRun.status !== 'BROUILLON') {
            throw new Error('Le cycle doit être en brouillon pour être approuvé');
        }
        // Vérifier que tous les bulletins ont été générés
        if (payRun.payslips.length === 0) {
            throw new Error('Aucun bulletin généré pour ce cycle');
        }
        // Approuver le cycle
        const updatedPayRun = await prisma.payRun.update({
            where: { id },
            data: { status: 'APPROUVE' },
            include: {
                company: true,
                payslips: {
                    include: {
                        employee: true
                    }
                }
            }
        });
        return updatedPayRun;
    }
    static async closePayRun(id) {
        const payRun = await prisma.payRun.findUnique({
            where: { id },
            include: {
                payslips: true
            }
        });
        if (!payRun) {
            throw new Error('Cycle de paie non trouvé');
        }
        if (payRun.status !== 'APPROUVE') {
            throw new Error('Le cycle doit être approuvé pour être clôturé');
        }
        // Vérifier que tous les bulletins sont payés
        const unpaidPayslips = payRun.payslips.filter((p) => p.status === 'EN_ATTENTE');
        if (unpaidPayslips.length > 0) {
            throw new Error('Tous les bulletins doivent être payés avant de clôturer le cycle');
        }
        const updatedPayRun = await prisma.payRun.update({
            where: { id },
            data: { status: 'CLOTURE' },
            include: {
                company: true
            }
        });
        return updatedPayRun;
    }
    static async getPayRunsByCompany(companyId) {
        const payRuns = await prisma.payRun.findMany({
            where: { companyId },
            include: {
                payslips: {
                    include: {
                        employee: true,
                        payments: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return payRuns;
    }
}
exports.PayRunService = PayRunService;
//# sourceMappingURL=payRunService.js.map