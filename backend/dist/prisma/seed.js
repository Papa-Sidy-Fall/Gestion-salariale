"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Créer un Super Admin par défaut
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@salaryapp.com' },
        update: {},
        create: {
            email: 'admin@salaryapp.com',
            password: hashedPassword,
            role: 'SUPER_ADMIN'
        }
    });
    console.log('Super Admin créé:', superAdmin.email);
    // Créer une entreprise de test
    const company = await prisma.company.create({
        data: {
            name: 'Entreprise Test',
            address: '123 Rue de Test, Dakar',
            phone: '+221 77 123 45 67',
            email: 'contact@test.com'
        }
    });
    console.log('Entreprise créée:', company.name);
    // Créer un Admin pour cette entreprise
    const adminPassword = await bcrypt_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password: adminPassword,
            role: 'ADMIN',
            companyId: company.id
        }
    });
    console.log('Admin créé:', admin.email);
    // Créer un employé de test
    const employee = await prisma.employee.create({
        data: {
            firstName: 'Jean',
            lastName: 'Dupont',
            position: 'Développeur',
            contractType: 'FIXE',
            rate: 500000,
            bankDetails: 'IBAN: FR1234567890123456789012345',
            isActive: true,
            companyId: company.id
        }
    });
    console.log('Employé créé:', `${employee.firstName} ${employee.lastName}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map