import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class PayRunController {
    static createPayRun(req: AuthRequest, res: Response): Promise<void>;
    static getAllPayRuns(req: AuthRequest, res: Response): Promise<void>;
    static getPayRunById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updatePayRun(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deletePayRun(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static generatePayslips(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static approvePayRun(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static closePayRun(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getPayRunsByCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=payRunController.d.ts.map