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
            budget: number;
        };
    } & {
        id: string;
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
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
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
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
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
    } & {
        id: string;
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
    } & {
        id: string;
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
    } & {
        id: string;
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
                fixedEmployeePaymentOption: string;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
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
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
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
            budget: number;
        };
        payslips: ({
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
            };
            payments: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                payslipId: string;
                amount: number;
                method: import(".prisma/client").$Enums.PaymentMethod;
                date: Date;
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
        email: string | null;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        position: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        rate: number;
        dailyRate: number;
        hourlyRate: number;
        isActive: boolean;
    })[]>;
}
//# sourceMappingURL=employeeService.d.ts.map