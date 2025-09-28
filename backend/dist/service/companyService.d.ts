export declare class CompanyService {
    static createCompany(data: {
        name: string;
        address?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string | null;
        phone: string | null;
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
    })[]>;
    static getCompanyById(id: string): Promise<{
        users: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
        }[];
        employees: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            firstName: string;
            lastName: string;
            position: string;
            contractType: import(".prisma/client").$Enums.ContractType;
            rate: number;
            bankDetails: string | null;
            isActive: boolean;
        }[];
        payRuns: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
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
    }>;
    static updateCompany(id: string, data: {
        name?: string;
        address?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        address: string | null;
        phone: string | null;
    }>;
    static deleteCompany(id: string): Promise<{
        message: string;
    }>;
    static getCompanyStats(companyId: string): Promise<{
        employeeCount: number;
        totalSalary: number;
        payRunsCount: number;
    }>;
}
//# sourceMappingURL=companyService.d.ts.map