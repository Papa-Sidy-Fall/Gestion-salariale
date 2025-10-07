export declare class PayRunService {
    static createPayRun(data: {
        period: string;
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    }>;
    static getAllPayRuns(companyId?: string): Promise<({
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
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                position: string | null;
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    })[]>;
    static getPayRunById(id: string): Promise<{
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
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                position: string | null;
                contractType: import(".prisma/client").$Enums.ContractType;
                rate: number;
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    }>;
    static updatePayRun(id: string, data: any): Promise<{
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    }>;
    static deletePayRun(id: string): Promise<{
        message: string;
    }>;
    static generatePayslips(payRunId: string): Promise<({
        employee: {
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
        };
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
    })[]>;
    static approvePayRun(id: string): Promise<{
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
            employee: {
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
            };
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
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    }>;
    static closePayRun(id: string): Promise<{
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    }>;
    static getPayRunsByCompany(companyId: string): Promise<({
        payslips: ({
            employee: {
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
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
        fixedEmployeePaymentOption: string;
    })[]>;
    static payJournalierEmployee(employeeId: string, companyId: string): Promise<{
        payRun: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            period: string;
            status: import(".prisma/client").$Enums.PayRunStatus;
            fixedEmployeePaymentOption: string;
        };
        payslip: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayslipStatus;
            employeeId: string;
            payRunId: string;
            gross: number;
            deductions: number;
            net: number;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            payslipId: string;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            date: Date;
        };
        amount: number;
    }>;
}
//# sourceMappingURL=payRunService.d.ts.map