"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Fonction utilitaire pour parser une période "YYYY-MM"
function parsePeriod(period) {
    const periodParts = period.split('-');
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
    return { startDate, endDate };
}
class AttendanceService {
    // Créer un pointage
    static async createAttendance(data) {
        // Calculer les heures travaillées si checkIn et checkOut sont fournis
        let hoursWorked = 0;
        if (data.checkIn && data.checkOut) {
            const diffMs = data.checkOut.getTime() - data.checkIn.getTime();
            hoursWorked = diffMs / (1000 * 60 * 60); // Convertir en heures
        }
        const attendance = await prisma.attendance.create({
            data: Object.assign(Object.assign({}, data), { hoursWorked }),
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        contractType: true,
                    },
                },
            },
        });
        return attendance;
    }
    // Pointer l'arrivée (check-in)
    static async checkIn(employeeId, date) {
        const checkInDate = date || new Date();
        const dateString = checkInDate.toISOString().split('T')[0];
        if (!dateString) {
            throw new Error('Date invalide');
        }
        const dateOnly = new Date(dateString);
        // Vérifier si un pointage existe déjà pour ce jour
        const existing = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: dateOnly,
                },
            },
        });
        if (existing) {
            // Mettre à jour le check-in
            return await prisma.attendance.update({
                where: { id: existing.id },
                data: {
                    checkIn: checkInDate,
                    status: client_1.AttendanceStatus.PRESENT,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                        },
                    },
                },
            });
        }
        // Créer un nouveau pointage
        return await this.createAttendance({
            employeeId,
            date: dateOnly,
            checkIn: checkInDate,
            status: client_1.AttendanceStatus.PRESENT,
        });
    }
    // Pointer le départ (check-out)
    static async checkOut(employeeId, date) {
        const checkOutDate = date || new Date();
        const dateString = checkOutDate.toISOString().split('T')[0];
        if (!dateString) {
            throw new Error('Date invalide');
        }
        const dateOnly = new Date(dateString);
        const attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: dateOnly,
                },
            },
        });
        if (!attendance) {
            throw new Error('Aucun pointage d\'arrivée trouvé pour ce jour');
        }
        if (!attendance.checkIn) {
            throw new Error('Veuillez d\'abord pointer l\'arrivée');
        }
        // Calculer les heures travaillées
        const diffMs = checkOutDate.getTime() - attendance.checkIn.getTime();
        const hoursWorked = diffMs / (1000 * 60 * 60);
        return await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOut: checkOutDate,
                hoursWorked,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                    },
                },
            },
        });
    }
    // Obtenir tous les pointages
    static async getAllAttendances(filters) {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.employeeId) {
            where.employeeId = filters.employeeId;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            where.status = filters.status;
        }
        if ((filters === null || filters === void 0 ? void 0 : filters.startDate) || (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.date.lte = filters.endDate;
            }
        }
        if (filters === null || filters === void 0 ? void 0 : filters.companyId) {
            where.employee = {
                companyId: filters.companyId,
            };
        }
        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        contractType: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return attendances;
    }
    // Obtenir un pointage par ID
    static async getAttendanceById(id) {
        const attendance = await prisma.attendance.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        contractType: true,
                    },
                },
            },
        });
        if (!attendance) {
            throw new Error('Pointage non trouvé');
        }
        return attendance;
    }
    // Obtenir les pointages d'un employé
    static async getAttendancesByEmployee(employeeId, period) {
        const where = { employeeId };
        if (period) {
            // Format: "YYYY-MM"
            const { startDate, endDate } = parsePeriod(period);
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        contractType: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return attendances;
    }
    // Mettre à jour un pointage
    static async updateAttendance(id, data) {
        // Recalculer les heures si nécessaire
        let updateData = Object.assign({}, data);
        if (data.checkIn || data.checkOut) {
            const current = await prisma.attendance.findUnique({
                where: { id },
            });
            if (current) {
                const checkIn = data.checkIn || current.checkIn;
                const checkOut = data.checkOut || current.checkOut;
                if (checkIn && checkOut) {
                    const diffMs = checkOut.getTime() - checkIn.getTime();
                    updateData.hoursWorked = diffMs / (1000 * 60 * 60);
                }
            }
        }
        const attendance = await prisma.attendance.update({
            where: { id },
            data: updateData,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                    },
                },
            },
        });
        return attendance;
    }
    // Supprimer un pointage
    static async deleteAttendance(id) {
        await prisma.attendance.delete({
            where: { id },
        });
        return { message: 'Pointage supprimé avec succès' };
    }
    // Obtenir les statistiques de pointage
    static async getAttendanceStats(filters) {
        const where = {};
        if (filters.employeeId) {
            where.employeeId = filters.employeeId;
        }
        if (filters.companyId) {
            where.employee = {
                companyId: filters.companyId,
            };
        }
        if (filters.period) {
            const { startDate, endDate } = parsePeriod(filters.period);
            where.date = {
                gte: startDate,
                lte: endDate,
            };
        }
        const attendances = await prisma.attendance.findMany({
            where,
        });
        const totalDays = attendances.length;
        const presentDays = attendances.filter(a => a.status === client_1.AttendanceStatus.PRESENT).length;
        const absentDays = attendances.filter(a => a.status === client_1.AttendanceStatus.ABSENT).length;
        const leaveDays = attendances.filter(a => a.status === client_1.AttendanceStatus.CONGE).length;
        const sickDays = attendances.filter(a => a.status === client_1.AttendanceStatus.MALADIE).length;
        const totalHours = attendances.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
        return {
            totalDays,
            presentDays,
            absentDays,
            leaveDays,
            sickDays,
            totalHours,
            attendanceRate: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
        };
    }
    // Calculer le salaire basé sur les pointages
    static async calculateSalaryFromAttendance(employeeId, period) {
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee) {
            throw new Error('Employé non trouvé');
        }
        const { startDate, endDate } = parsePeriod(period);
        const attendances = await prisma.attendance.findMany({
            where: {
                employeeId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                status: client_1.AttendanceStatus.PRESENT,
            },
        });
        let gross = 0;
        switch (employee.contractType) {
            case 'FIXE':
                // Salaire fixe, pas de calcul basé sur pointages
                gross = employee.rate;
                break;
            case 'JOURNALIER':
                // Nombre de jours travaillés × taux journalier
                const daysWorked = attendances.length;
                gross = daysWorked * (employee.dailyRate || 0);
                break;
            case 'HONORAIRE':
                // Somme des heures travaillées × taux horaire
                const totalHours = attendances.reduce((sum, a) => sum + (a.hoursWorked || 0), 0);
                gross = totalHours * (employee.hourlyRate || 0);
                break;
        }
        return {
            employeeId,
            period,
            contractType: employee.contractType,
            daysWorked: attendances.length,
            totalHours: attendances.reduce((sum, a) => sum + (a.hoursWorked || 0), 0),
            rate: employee.rate,
            dailyRate: employee.dailyRate,
            hourlyRate: employee.hourlyRate,
            gross,
        };
    }
    // Obtenir les pointages par période
    static async getAttendancesByPeriod(period, companyId) {
        const { startDate, endDate } = parsePeriod(period);
        const where = {
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (companyId) {
            where.employee = {
                companyId,
            };
        }
        const attendances = await prisma.attendance.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        contractType: true,
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { date: 'desc' },
                { employee: { lastName: 'asc' } },
            ],
        });
        return attendances;
    }
    // Obtenir le pointage du jour pour un employé
    static async getTodayAttendance(employeeId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId,
                    date: today,
                },
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return attendance;
    }
    // Saisie manuelle des heures par le caissier (pour employés HONORAIRE)
    static async manualTimeEntry(data) {
        // Vérifier que l'employé existe et est de type HONORAIRE
        const employee = await prisma.employee.findUnique({
            where: { id: data.employeeId },
        });
        if (!employee) {
            throw new Error('Employé non trouvé');
        }
        if (employee.contractType !== 'HONORAIRE') {
            throw new Error('Cette fonctionnalité est réservée aux employés HONORAIRE');
        }
        // Calculer les heures travaillées
        const diffMs = data.checkOut.getTime() - data.checkIn.getTime();
        const hoursWorked = diffMs / (1000 * 60 * 60); // Convertir en heures
        if (hoursWorked <= 0) {
            throw new Error('L\'heure de départ doit être après l\'heure d\'arrivée');
        }
        // Vérifier si un pointage existe déjà pour cette date
        const existing = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId: data.employeeId,
                    date: data.date,
                },
            },
        });
        if (existing) {
            // Mettre à jour le pointage existant
            return await prisma.attendance.update({
                where: { id: existing.id },
                data: {
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    hoursWorked,
                    status: client_1.AttendanceStatus.PRESENT,
                    notes: data.notes,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                            contractType: true,
                            hourlyRate: true,
                        },
                    },
                },
            });
        }
        // Créer un nouveau pointage
        return await this.createAttendance({
            employeeId: data.employeeId,
            date: data.date,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            status: client_1.AttendanceStatus.PRESENT,
            notes: data.notes,
        });
    }
}
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendanceService.js.map