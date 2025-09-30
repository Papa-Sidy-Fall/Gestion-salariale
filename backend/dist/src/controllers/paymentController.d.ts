import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class PaymentController {
    static createPayment(req: AuthRequest, res: Response): Promise<void>;
    static getPaymentsByPayslip(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getPaymentsByCompany(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAllPayments(req: AuthRequest, res: Response): Promise<void>;
    static deletePayment(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getPaymentStats(req: AuthRequest, res: Response): Promise<void>;
    static generateInvoicePDF(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=paymentController.d.ts.map