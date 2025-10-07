export declare class CompanyService {
    static createCompany(data: {
        name: string;
        address?: string;
        phone?: string;
        email?: string;
        logo?: string;
        color?: string;
    }): Promise<{
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
    }>;
    static getAllCompanies(): Promise<({
        users: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        }[];
        employees: {
            id: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
        }[];
        payRuns: {
            id: string;
            period: string;
            status: import(".prisma/client").$Enums.PayRunStatus;
        }[];
    } & {
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
    })[]>;
    static getCompanyById(id: string): Promise<{
        users: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            companyId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        employees: {
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
        }[];
        payRuns: {
            id: string;
            companyId: string;
            createdAt: Date;
            updatedAt: Date;
            period: string;
            status: import(".prisma/client").$Enums.PayRunStatus;
            fixedEmployeePaymentOption: string;
        }[];
    } & {
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
    }>;
    static updateCompany(id: string, data: {
        name?: string;
        address?: string;
        phone?: string;
        email?: string;
        logo?: string;
        color?: string;
    }): Promise<{
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
    }>;
    static deleteCompany(id: string): Promise<{
        message: string;
    }>;
    static getCompanyStats(companyId: string): Promise<{
        employeeCount: number;
        totalSalary: number;
        payRunsCount: number;
        budget: number;
    }>;
}
//# sourceMappingURL=companyService.d.ts.map