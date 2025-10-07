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
        const payRun = await prisma.payRun.findUnique({
            where: { id },
            include: {
                payslips: true,
                company: true
            }
        });
        if (!payRun) {
            throw new Error('Cycle de paie non trouvé');
        }
        // Calculer le montant total des bulletins payés pour rembourser le budget si nécessaire
        const totalPaid = payRun.payslips.reduce((sum, payslip) => {
            if (payslip.status === 'PAYE' || payslip.status === 'PARTIEL') { // Inclure PARTIEL pour le remboursement
                return sum + payslip.net;
            }
            return sum;
        }, 0);
        // Si le cycle était approuvé ou clôturé et que des montants ont été payés, rembourser le budget
        if ((payRun.status === 'APPROUVE' || payRun.status === 'CLOTURE') && totalPaid > 0) {
            const company = await prisma.company.findUnique({ where: { id: payRun.company.id } });
            if (company) {
                const newBudget = company.budget + totalPaid;
                await prisma.company.update({
                    where: { id: payRun.company.id },
                    data: { budget: newBudget }
                });
            }
        }
        // Supprimer d'abord les paiements liés aux bulletins
        await prisma.payment.deleteMany({
            where: {
                payslip: {
                    payRunId: id
                }
            }
        });
        // Supprimer les bulletins
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
                payslips: true,
                // Inclure l'option de paiement pour les employés fixes
                // fixedEmployeePaymentOption: true // Ceci n'est pas nécessaire car c'est déjà un champ du modèle PayRun
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
        // Calculer les dates de début et fin de la période
        const periodParts = payRun.period.split('-');
        if (periodParts.length !== 2) {
            throw new Error('Format de période invalide');
        }
        const yearStr = periodParts[0];
        const monthStr = periodParts[1];
        if (!yearStr || !monthStr) {
            throw new Error('Format de période invalide');
        }
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        if (isNaN(year) || isNaN(month)) {
            throw new Error('Format de période invalide');
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        for (const employee of employees) {
            let grossSalary = 0;
            let daysWorked = 0;
            let totalHours = 0;
            // Calculer les jours travaillés/heures pour tous les types de contrats
            const attendances = await prisma.attendance.findMany({
                where: {
                    employeeId: employee.id,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: client_1.AttendanceStatus.PRESENT,
                },
            });
            daysWorked = attendances.length;
            totalHours = attendances.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
            // Calculer le salaire selon le type de contrat et l'option de paiement pour les fixes
            if (employee.contractType === 'FIXE') {
                if (payRun.fixedEmployeePaymentOption === 'FULL_MONTH') {
                    grossSalary = employee.rate; // Salaire fixe complet
                }
                else if (payRun.fixedEmployeePaymentOption === 'DAYS_WORKED') {
                    grossSalary = daysWorked * (employee.dailyRate || (employee.rate / 30)); // Payer au prorata des jours travaillés
                }
            }
            else if (employee.contractType === 'JOURNALIER') {
                grossSalary = daysWorked * (employee.dailyRate || 0);
            }
            else if (employee.contractType === 'HONORAIRE') {
                grossSalary = totalHours * (employee.hourlyRate || 0);
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
                payslips: true,
                company: true
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
        // Calculer le total des salaires pour ce cycle
        const totalSalary = payRun.payslips.reduce((sum, payslip) => sum + payslip.net, 0);
        // Vérifier que le budget de l'entreprise permet de payer
        if (totalSalary > payRun.company.budget) {
            throw new Error(`Budget insuffisant. Total demandé: ${totalSalary} FCFA, Budget disponible: ${payRun.company.budget} FCFA`);
        }
        // Déduire du budget
        const newBudget = payRun.company.budget - totalSalary;
        await prisma.company.update({
            where: { id: payRun.company.id },
            data: { budget: newBudget }
        });
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
    static async payJournalierEmployee(employeeId, companyId) {
        // Vérifier que l'employé existe et est journalier
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: { company: true }
        });
        if (!employee) {
            throw new Error('Employé non trouvé');
        }
        if (employee.contractType !== 'JOURNALIER') {
            throw new Error('Cette fonction est réservée aux employés journaliers');
        }
        if (employee.companyId !== companyId) {
            throw new Error('Employé non autorisé pour cette entreprise');
        }
        // Vérifier le pointage du jour
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: today
                }
            }
        });
        if (!attendance || !attendance.checkOut) {
            throw new Error('L\'employé n\'a pas encore pointé son départ aujourd\'hui');
        }
        if (attendance.status !== 'PRESENT') {
            throw new Error('L\'employé n\'est pas marqué comme présent aujourd\'hui');
        }
        // Créer un cycle de paie spécial pour ce paiement journalier
        const period = `DAILY-${today.toISOString().split('T')[0]}`;
        const payRun = await prisma.payRun.create({
            data: {
                period,
                companyId,
                status: 'BROUILLON'
            }
        });
        // Calculer le salaire journalier
        const grossSalary = employee.dailyRate || 0;
        const deductions = grossSalary * 0.05; // 5% de déductions
        const netSalary = grossSalary - deductions;
        // Créer le bulletin
        const payslip = await prisma.payslip.create({
            data: {
                employeeId,
                payRunId: payRun.id,
                gross: grossSalary,
                deductions,
                net: netSalary,
                status: 'EN_ATTENTE'
            }
        });
        // Vérifier le budget
        if (netSalary > employee.company.budget) {
            throw new Error(`Budget insuffisant. Montant demandé: ${netSalary} FCFA, Budget disponible: ${employee.company.budget} FCFA`);
        }
        // Déduire du budget
        const newBudget = employee.company.budget - netSalary;
        await prisma.company.update({
            where: { id: companyId },
            data: { budget: newBudget }
        });
        // Générer le paiement
        const payment = await prisma.payment.create({
            data: {
                payslipId: payslip.id,
                amount: netSalary,
                method: 'ESPECES'
            }
        });
        // Marquer le bulletin comme payé
        await prisma.payslip.update({
            where: { id: payslip.id },
            data: { status: 'PAYE' }
        });
        // Approuver et clôturer immédiatement le cycle
        await prisma.payRun.update({
            where: { id: payRun.id },
            data: { status: 'CLOTURE' }
        });
        return {
            payRun,
            payslip,
            payment,
            amount: netSalary
        };
    }
}
exports.PayRunService = PayRunService;
//# sourceMappingURL=payRunService.js.map