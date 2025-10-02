"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const attendanceService_1 = require("../service/attendanceService");
const client_1 = require("@prisma/client");
class AttendanceController {
    // Créer un pointage
    static async createAttendance(req, res) {
        try {
            const { employeeId, date, checkIn, checkOut, status, notes } = req.body;
            if (!employeeId || !date) {
                return res.status(400).json({ error: 'ID employé et date requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.createAttendance({
                employeeId,
                date: new Date(date),
                checkIn: checkIn ? new Date(checkIn) : undefined,
                checkOut: checkOut ? new Date(checkOut) : undefined,
                status: status || client_1.AttendanceStatus.PRESENT,
                notes,
            });
            res.status(201).json({
                message: 'Pointage créé avec succès',
                attendance,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Pointer l'arrivée
    static async checkIn(req, res) {
        try {
            const { employeeId, date } = req.body;
            if (!employeeId) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.checkIn(employeeId, date ? new Date(date) : undefined);
            res.json({
                message: 'Arrivée pointée avec succès',
                attendance,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Pointer le départ
    static async checkOut(req, res) {
        try {
            const { employeeId, date } = req.body;
            if (!employeeId) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.checkOut(employeeId, date ? new Date(date) : undefined);
            res.json({
                message: 'Départ pointé avec succès',
                attendance,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir tous les pointages
    static async getAllAttendances(req, res) {
        var _a, _b;
        try {
            const { employeeId, startDate, endDate, status, companyId } = req.query;
            // Vérifier les permissions
            let filterCompanyId = companyId;
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
                filterCompanyId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) || '';
            }
            const attendances = await attendanceService_1.AttendanceService.getAllAttendances({
                employeeId: employeeId,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                status: status,
                companyId: filterCompanyId,
            });
            res.json({ attendances });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir un pointage par ID
    static async getAttendanceById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID pointage requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.getAttendanceById(id);
            res.json({ attendance });
        }
        catch (error) {
            if (error.message === 'Pointage non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir les pointages d'un employé
    static async getAttendancesByEmployee(req, res) {
        try {
            const { employeeId } = req.params;
            const { period } = req.query;
            if (!employeeId) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const attendances = await attendanceService_1.AttendanceService.getAttendancesByEmployee(employeeId, period);
            res.json({ attendances });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir les pointages par période
    static async getAttendancesByPeriod(req, res) {
        var _a, _b;
        try {
            const { period, companyId } = req.query;
            if (!period) {
                return res.status(400).json({ error: 'Période requise (format: YYYY-MM)' });
            }
            // Vérifier les permissions
            let filterCompanyId = companyId;
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
                filterCompanyId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) || '';
            }
            const attendances = await attendanceService_1.AttendanceService.getAttendancesByPeriod(period, filterCompanyId);
            res.json({ attendances });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Mettre à jour un pointage
    static async updateAttendance(req, res) {
        try {
            const { id } = req.params;
            const { checkIn, checkOut, status, notes } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'ID pointage requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.updateAttendance(id, {
                checkIn: checkIn ? new Date(checkIn) : undefined,
                checkOut: checkOut ? new Date(checkOut) : undefined,
                status,
                notes,
            });
            res.json({
                message: 'Pointage mis à jour avec succès',
                attendance,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Supprimer un pointage
    static async deleteAttendance(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID pointage requis' });
            }
            const result = await attendanceService_1.AttendanceService.deleteAttendance(id);
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir les statistiques de pointage
    static async getAttendanceStats(req, res) {
        var _a, _b;
        try {
            const { employeeId, companyId, period } = req.query;
            // Vérifier les permissions
            let filterCompanyId = companyId;
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN') {
                filterCompanyId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) || '';
            }
            const stats = await attendanceService_1.AttendanceService.getAttendanceStats({
                employeeId: employeeId,
                companyId: filterCompanyId,
                period: period,
            });
            res.json({ stats });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Calculer le salaire basé sur les pointages
    static async calculateSalary(req, res) {
        try {
            const { employeeId, period } = req.query;
            if (!employeeId || !period) {
                return res.status(400).json({ error: 'ID employé et période requis' });
            }
            const calculation = await attendanceService_1.AttendanceService.calculateSalaryFromAttendance(employeeId, period);
            res.json({ calculation });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Obtenir le pointage du jour pour un employé
    static async getTodayAttendance(req, res) {
        try {
            const { employeeId } = req.query;
            if (!employeeId) {
                return res.status(400).json({ error: 'ID employé requis' });
            }
            const attendance = await attendanceService_1.AttendanceService.getTodayAttendance(employeeId);
            res.json(attendance);
        }
        catch (error) {
            if (error.message === 'Pointage non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }
    // Saisie manuelle des heures par le caissier (pour employés HONORAIRE)
    static async manualTimeEntry(req, res) {
        var _a, _b;
        try {
            const { employeeId, date, checkIn, checkOut, notes } = req.body;
            if (!employeeId || !date || !checkIn || !checkOut) {
                return res.status(400).json({ error: 'ID employé, date, heure d\'arrivée et heure de départ requis' });
            }
            // Vérifier que l'utilisateur a accès à cette entreprise
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'CAISSIER') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const attendance = await attendanceService_1.AttendanceService.manualTimeEntry({
                employeeId,
                date: new Date(date),
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                notes,
            });
            res.status(201).json({
                message: 'Heures saisies avec succès',
                attendance,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendanceController.js.map