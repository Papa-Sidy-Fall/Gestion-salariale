import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class AttendanceController {
    static createAttendance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static checkIn(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static checkOut(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAllAttendances(req: AuthRequest, res: Response): Promise<void>;
    static getAttendanceById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAttendancesByEmployee(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAttendancesByPeriod(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateAttendance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteAttendance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getAttendanceStats(req: AuthRequest, res: Response): Promise<void>;
    static calculateSalary(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTodayAttendance(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static manualTimeEntry(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=attendanceController.d.ts.map