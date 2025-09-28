"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
class AuthService {
    static async register(email, password, role, companyId) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                companyId
            },
            select: {
                id: true,
                email: true,
                role: true,
                companyId: true,
                createdAt: true
            }
        });
        return user;
    }
    static async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                company: true
            }
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, companyId: user.companyId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                company: user.company
            },
            token
        };
    }
    static async getUserById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                company: true
            }
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map