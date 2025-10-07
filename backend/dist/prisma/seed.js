"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Début du seeding...');
    // Créer un Super Admin par défaut
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    console.log('Tentative de création du Super Admin...');
    const superAdmin = await prisma.user.upsert({
        where: { email: 'super@test.com' },
        update: {},
        create: {
            email: 'super@test.com',
            password: hashedPassword,
            role: 'SUPER_ADMIN'
        }
    });
    console.log('✅ Super Admin créé:', superAdmin.email);
    // Créer une entreprise de test
    const company = await prisma.company.create({
        data: {
            name: 'Entreprise Test',
            address: '123 Rue de Test, Dakar',
            phone: '+221 77 123 45 67',
            email: 'contact@test.com'
        }
    });
    console.log('✅ Entreprise créée:', company.name);
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
    console.log('✅ Admin créé:', admin.email);
    // Créer un Caissier pour cette entreprise
    const caissierPassword = await bcrypt_1.default.hash('caissier123', 10);
    const caissier = await prisma.user.upsert({
        where: { email: 'caissier@test.com' },
        update: {},
        create: {
            email: 'caissier@test.com',
            password: caissierPassword,
            role: 'CAISSIER',
            companyId: company.id
        }
    });
    console.log('✅ Caissier créé:', caissier.email);
    // Créer des employés de test
    const employees = await Promise.all([
        prisma.employee.create({
            data: {
                firstName: 'Jean',
                lastName: 'Dupont',
                position: 'Développeur',
                contractType: 'FIXE',
                rate: 500000,
                isActive: true,
                companyId: company.id
            }
        }),
        prisma.employee.create({
            data: {
                firstName: 'Marie',
                lastName: 'Martin',
                position: 'Designer',
                contractType: 'FIXE',
                rate: 400000,
                isActive: true,
                companyId: company.id
            }
        }),
        prisma.employee.create({
            data: {
                firstName: 'Pierre',
                lastName: 'Durand',
                position: 'Manager',
                contractType: 'FIXE',
                rate: 600000,
                isActive: true,
                companyId: company.id
            }
        })
    ]);
    console.log('✅ Employés créés:', employees.length);
    console.log('\n🎯 Comptes de test disponibles:');
    console.log('Super Admin: super@test.com / admin123');
    console.log('Admin: admin@test.com / admin123');
    console.log('Caissier: caissier@test.com / caissier123');
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