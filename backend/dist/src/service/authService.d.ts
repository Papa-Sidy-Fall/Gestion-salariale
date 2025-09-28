declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    CAISSIER = "CAISSIER",
    EMPLOYEE = "EMPLOYEE"
}
export declare class AuthService {
    static register(email: string, password: string, role: UserRole, companyId?: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        companyId: string | null;
        createdAt: Date;
    }>;
    static login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            companyId: string | null;
            company: {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string | null;
                phone: string | null;
            } | null;
        };
        token: string;
    }>;
    static getUserById(id: string): Promise<{
        company: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string | null;
            phone: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        companyId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
//# sourceMappingURL=authService.d.ts.map