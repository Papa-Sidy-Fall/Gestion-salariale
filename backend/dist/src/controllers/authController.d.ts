import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class AuthController {
    static register(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUsersByCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=authController.d.ts.map