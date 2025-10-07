export declare class PaymentService {
    static createPayment(data: {
        payslipId: string;
        amount: number;
        method: string;
    }): Promise<{
        payslip: {
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
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        payslipId: string;
        amount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        date: Date;
    }>;
    static getPaymentsByPayslip(payslipId: string): Promise<({
        payslip: {
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
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        payslipId: string;
        amount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        date: Date;
    })[]>;
    static getPaymentsByCompany(companyId: string): Promise<({
        payslip: {
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
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        payslipId: string;
        amount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        date: Date;
    })[]>;
    static getAllPayments(): Promise<({
        payslip: {
            employee: {
                id: string;
                firstName: string;
                lastName: string;
                position: string | null;
            };
            payRun: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        payslipId: string;
        amount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        date: Date;
    })[]>;
    static getPaymentById(id: string): Promise<({
        payslip: {
            employee: {
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
            };
            payRun: {
                id: string;
                companyId: string;
                createdAt: Date;
                updatedAt: Date;
                period: string;
                status: import(".prisma/client").$Enums.PayRunStatus;
                fixedEmployeePaymentOption: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        payslipId: string;
        amount: number;
        method: import(".prisma/client").$Enums.PaymentMethod;
        date: Date;
    }) | null>;
    static deletePayment(id: string): Promise<{
        message: string;
    }>;
    static getPaymentStats(companyId?: string): Promise<{
        totalPayments: number;
        totalAmount: number;
        paymentsByMethod: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PaymentGroupByOutputType, "method"[]> & {
            _count: number;
            _sum: {
                amount: number | null;
            };
        })[];
    }>;
}
//# sourceMappingURL=paymentService.d.ts.map