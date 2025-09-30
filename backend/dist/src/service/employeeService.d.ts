export declare class EmployeeService {
    static createEmployee(data: {
        firstName: string;
        lastName: string;
        position: string;
        contractType: any;
        rate: number;
        bankDetails?: string;
        companyId: string;
    }): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    }>;
    static getAllEmployees(companyId?: string): Promise<({
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
                receiptPdf: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        })[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    })[]>;
    static getEmployeeById(id: string): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
                receiptPdf: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        })[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    }>;
    static updateEmployee(id: string, data: any): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    }>;
    static toggleEmployeeStatus(id: string): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    }>;
    static deleteEmployee(id: string): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    }>;
    static getEmployeesByCompany(companyId: string): Promise<({
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
                receiptPdf: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        })[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    })[]>;
    static getEmployeeStats(employeeId: string): Promise<{
        totalPayslips: number;
        totalPaid: number;
        totalOwed: number;
        lastPayslip: ({
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
                receiptPdf: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        }) | null;
    }>;
    static filterEmployees(filters: {
        companyId?: string;
        contractType?: string;
        position?: string;
        isActive?: boolean;
    }): Promise<({
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
            logo: string | null;
            color: string | null;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
                receiptPdf: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        })[];
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        bankDetails: string | null;
        isActive: boolean;
    })[]>;
}
//# sourceMappingURL=employeeService.d.ts.map