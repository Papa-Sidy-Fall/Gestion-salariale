import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class CompanyController {
    static createCompany(req: AuthRequest, res: Response): Promise<void>;
    static getAllCompanies(req: AuthRequest, res: Response): Promise<void>;
    static getCompanyById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getCompanyStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=companyController.d.ts.map