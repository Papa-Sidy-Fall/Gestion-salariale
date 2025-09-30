import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class EmployeeController {
    static createEmployee(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAllEmployees(req: AuthRequest, res: Response): Promise<void>;
    static getEmployeeById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateEmployee(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static toggleEmployeeStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteEmployee(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getEmployeesByCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getEmployeeStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static filterEmployees(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=employeeController.d.ts.map