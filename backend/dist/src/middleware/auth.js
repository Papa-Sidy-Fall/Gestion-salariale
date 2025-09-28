"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeCompanyAccess = exports.authorizeRoles = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token d\'authentification requis' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, companyId: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentification requise' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const authorizeCompanyAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentification requise' });
    }
    // Super admin peut accéder à tout
    if (req.user.role === 'SUPER_ADMIN') {
        return next();
    }
    // Pour les autres rôles, vérifier l'accès à l'entreprise
    const companyId = req.params.companyId || req.body.companyId || req.query.companyId;
    if (!companyId) {
        return res.status(400).json({ error: 'ID entreprise requis' });
    }
    if (req.user.companyId !== companyId) {
        return res.status(403).json({ error: 'Accès non autorisé à cette entreprise' });
    }
    next();
};
exports.authorizeCompanyAccess = authorizeCompanyAccess;
//# sourceMappingURL=auth.js.map