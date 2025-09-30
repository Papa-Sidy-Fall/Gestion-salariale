import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentService {
  static async createPayment(data: {
    payslipId: string;
    amount: number;
    method: string;
  }) {
    // Vérifier que le bulletin existe et n'est pas déjà payé
    const payslip = await prisma.payslip.findUnique({
      where: { id: data.payslipId },
      include: {
        payments: true,
        payRun: true
      }
    });

    if (!payslip) {
      throw new Error('Bulletin de salaire non trouvé');
    }

    if (payslip.payRun.status === 'CLOTURE') {
      throw new Error('Impossible de payer un bulletin d\'un cycle clôturé');
    }

    // Calculer le montant déjà payé
    const totalPaid = payslip.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
    const remainingAmount = payslip.net - totalPaid;

    if (data.amount > remainingAmount) {
      throw new Error(`Montant trop élevé. Montant restant à payer: ${remainingAmount} FCFA`);
    }

    const payment = await prisma.payment.create({
      data: {
        payslipId: data.payslipId,
        amount: data.amount,
        method: data.method as any
      },
      include: {
        payslip: {
          include: {
            employee: true,
            payRun: true
          }
        }
      }
    });

    // Mettre à jour le statut du bulletin
    const newTotalPaid = totalPaid + data.amount;
    let newStatus: any = 'PARTIEL';

    if (newTotalPaid >= payslip.net) {
      newStatus = 'PAYE';
    }

    await prisma.payslip.update({
      where: { id: data.payslipId },
      data: { status: newStatus }
    });

    return payment;
  }

  static async getPaymentsByPayslip(payslipId: string) {
    const payments = await prisma.payment.findMany({
      where: { payslipId },
      include: {
        payslip: {
          include: {
            employee: true,
            payRun: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return payments;
  }

  static async getPaymentsByCompany(companyId: string) {
    const payments = await prisma.payment.findMany({
      where: {
        payslip: {
          payRun: {
            companyId
          }
        }
      },
      include: {
        payslip: {
          include: {
            employee: true,
            payRun: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return payments;
  }

  static async getAllPayments() {
    const payments = await prisma.payment.findMany({
      include: {
        payslip: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true
              }
            },
            payRun: {
              include: {
                company: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return payments;
  }

  static async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        payslip: {
          include: {
            employee: {
              include: {
                company: true
              }
            },
            payRun: true
          }
        }
      }
    });

    return payment;
  }

  static async deletePayment(id: string) {
    // Vérifier que le paiement n'est pas sur un cycle clôturé
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        payslip: {
          include: {
            payRun: true
          }
        }
      }
    });

    if (!payment) {
      throw new Error('Paiement non trouvé');
    }

    if (payment.payslip.payRun.status === 'CLOTURE') {
      throw new Error('Impossible de supprimer un paiement d\'un cycle clôturé');
    }

    await prisma.payment.delete({
      where: { id }
    });

    // Recalculer le statut du bulletin
    const remainingPayments = await prisma.payment.findMany({
      where: { payslipId: payment.payslipId }
    });

    const totalPaid = remainingPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
    let newStatus: any = 'EN_ATTENTE';

    if (totalPaid > 0 && totalPaid < payment.payslip.net) {
      newStatus = 'PARTIEL';
    } else if (totalPaid >= payment.payslip.net) {
      newStatus = 'PAYE';
    }

    await prisma.payslip.update({
      where: { id: payment.payslipId },
      data: { status: newStatus }
    });

    return { message: 'Paiement supprimé avec succès' };
  }

  static async getPaymentStats(companyId?: string) {
    const whereClause = companyId ? {
      payslip: {
        payRun: { companyId }
      }
    } : {};

    const [totalPayments, totalAmount, paymentsByMethod] = await Promise.all([
      prisma.payment.count({ where: whereClause }),
      prisma.payment.aggregate({
        where: whereClause,
        _sum: { amount: true }
      }),
      prisma.payment.groupBy({
        by: ['method'],
        where: whereClause,
        _sum: { amount: true },
        _count: true
      })
    ]);

    return {
      totalPayments,
      totalAmount: totalAmount._sum.amount || 0,
      paymentsByMethod
    };
  }
}