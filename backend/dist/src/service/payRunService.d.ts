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
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
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
        };
        payslips: ({
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                position: string;
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
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
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
        };
        payslips: ({
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                position: string;
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
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
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
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
    }>;
    static deletePayRun(id: string): Promise<{
        message: string;
    }>;
    static generatePayslips(payRunId: string): Promise<({
        employee: {
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
        };
        payslips: ({
            employee: {
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
        };
    } & {
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
    }>;
    static getPayRunsByCompany(companyId: string): Promise<({
        payslips: ({
            employee: {
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
        period: string;
        status: import(".prisma/client").$Enums.PayRunStatus;
    })[]>;
}
//# sourceMappingURL=payRunService.d.ts.map