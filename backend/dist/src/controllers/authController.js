"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../service/authService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["CAISSIER"] = "CAISSIER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
})(UserRole || (UserRole = {}));
class AuthController {
    static async register(req, res) {
        var _a, _b;
        try {
            const { email, password, role, companyId } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Email, mot de passe et rôle requis' });
            }
            // Validation du rôle
            if (!Object.values(UserRole).includes(role)) {
                return res.status(400).json({ error: 'Rôle invalide' });
            }
            // Seuls les super admin peuvent créer des comptes super admin
            if (role === UserRole.SUPER_ADMIN && (!req.user || req.user.role !== UserRole.SUPER_ADMIN)) {
                return res.status(403).json({ error: 'Seul un super admin peut créer un compte super admin' });
            }
            // Pour les rôles ADMIN et CAISSIER, un companyId est requis
            if ((role === UserRole.ADMIN || role === UserRole.CAISSIER) && !companyId) {
                return res.status(400).json({ error: 'ID entreprise requis pour ce rôle' });
            }
            // Vérifier les permissions : Super admin peut créer partout, Admin seulement dans son entreprise
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === UserRole.ADMIN && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) !== companyId) {
                return res.status(403).json({ error: 'Accès non autorisé à cette entreprise' });
            }
            const user = await authService_1.AuthService.register(email, password, role, companyId);
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                user
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email et mot de passe requis' });
            }
            const result = await authService_1.AuthService.login(email, password);
            res.json(Object.assign({ message: 'Connexion réussie' }, result));
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    static async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Non authentifié' });
            }
            const user = await authService_1.AuthService.getUserById(req.user.id);
            res.json({ user });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getUsersByCompany(req, res) {
        var _a, _b;
        try {
            const { companyId } = req.query;
            if (!companyId || typeof companyId !== 'string') {
                return res.status(400).json({ error: 'ID entreprise requis' });
            }
            // Vérifier que l'utilisateur a accès à cette entreprise
            // Super admin peut voir tous, Admin peut voir son entreprise
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'SUPER_ADMIN' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.companyId) !== companyId) {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const users = await prisma.user.findMany({
                where: { companyId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
            res.json({ users });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map