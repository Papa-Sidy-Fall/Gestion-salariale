import { AttendanceStatus } from '@prisma/client';
export declare class AttendanceService {
    static createAttendance(data: {
        employeeId: string;
        date: Date;
        checkIn?: Date;
        checkOut?: Date;
        status: AttendanceStatus;
        notes?: string;
    }): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
    static checkIn(employeeId: string, date?: Date): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
    static checkOut(employeeId: string, date?: Date): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
    static getAllAttendances(filters?: {
        employeeId?: string;
        startDate?: Date;
        endDate?: Date;
        status?: AttendanceStatus;
        companyId?: string;
    }): Promise<({
        employee: {
            id: string;
            company: {
                id: string;
                name: string;
            };
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    })[]>;
    static getAttendanceById(id: string): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
    static getAttendancesByEmployee(employeeId: string, period?: string): Promise<({
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    })[]>;
    static updateAttendance(id: string, data: {
        checkIn?: Date;
        checkOut?: Date;
        status?: AttendanceStatus;
        notes?: string;
    }): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
    static deleteAttendance(id: string): Promise<{
        message: string;
    }>;
    static getAttendanceStats(filters: {
        employeeId?: string;
        companyId?: string;
        period?: string;
    }): Promise<{
        totalDays: number;
        presentDays: number;
        absentDays: number;
        leaveDays: number;
        sickDays: number;
        totalHours: number;
        attendanceRate: number;
    }>;
    static calculateSalaryFromAttendance(employeeId: string, period: string): Promise<{
        employeeId: string;
        period: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        daysWorked: number;
        totalHours: number;
        rate: number;
        dailyRate: number | null;
        hourlyRate: number | null;
        gross: number;
    }>;
    static getAttendancesByPeriod(period: string, companyId?: string): Promise<({
        employee: {
            id: string;
            company: {
                id: string;
                name: string;
            };
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    })[]>;
    static getTodayAttendance(employeeId: string): Promise<({
        employee: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }) | null>;
    static manualTimeEntry(data: {
        employeeId: string;
        date: Date;
        checkIn: Date;
        checkOut: Date;
        notes?: string;
    }): Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        hoursWorked: number | null;
        notes: string | null;
    }>;
}
//# sourceMappingURL=attendanceService.d.ts.map