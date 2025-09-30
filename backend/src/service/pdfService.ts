import puppeteer from 'puppeteer';

export class PDFService {
  static async generateInvoicePDF(paymentData: {
    payment: any;
    payslip: any;
    employee: any;
    company: any;
  }) {
    const { payment, payslip, employee, company } = paymentData;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture de paiement</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid ${company.color || '#6FA4AF'};
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 15px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: ${company.color || '#6FA4AF'};
            margin: 10px 0;
          }
          .invoice-title {
            font-size: 24px;
            color: #666;
            margin: 10px 0;
          }
          .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: ${company.color || '#6FA4AF'};
            margin: 10px 0;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .info-block {
            flex: 1;
          }
          .info-block h3 {
            font-size: 16px;
            color: ${company.color || '#6FA4AF'};
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-block p {
            margin: 5px 0;
            line-height: 1.5;
          }
          .payment-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid ${company.color || '#6FA4AF'};
          }
          .amount {
            font-size: 32px;
            font-weight: bold;
            color: ${company.color || '#6FA4AF'};
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #f0f8ff;
            border-radius: 8px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .signature {
            margin-top: 40px;
            text-align: right;
          }
          .signature-line {
            border-top: 1px solid #333;
            width: 200px;
            margin-left: auto;
            margin-top: 50px;
            padding-top: 10px;
            text-align: center;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${company.logo ? `<img src="${company.logo}" alt="${company.name}" class="company-logo">` : ''}
            <div class="company-name">${company.name}</div>
            <div class="invoice-title">FACTURE DE PAIEMENT</div>
            <div class="invoice-number">N° ${payment.id.slice(-8).toUpperCase()}</div>
          </div>

          <div class="info-section">
            <div class="info-block">
              <h3>Informations de l'entreprise</h3>
              <p><strong>${company.name}</strong></p>
              ${company.address ? `<p>${company.address}</p>` : ''}
              ${company.phone ? `<p>Tél: ${company.phone}</p>` : ''}
              ${company.email ? `<p>Email: ${company.email}</p>` : ''}
            </div>

            <div class="info-block">
              <h3>Informations de l'employé</h3>
              <p><strong>${employee.firstName} ${employee.lastName}</strong></p>
              <p>Poste: ${employee.position}</p>
              <p>Contrat: ${employee.contractType}</p>
            </div>
          </div>

          <div class="payment-details">
            <h3>Détails du paiement</h3>
            <p><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString('fr-FR')}</p>
            <p><strong>Période:</strong> ${payslip.payRun?.period || 'N/A'}</p>
            <p><strong>Méthode:</strong> ${this.getPaymentMethodText(payment.method)}</p>
            <p><strong>Référence:</strong> ${payment.id}</p>
          </div>

          <div class="amount">
            ${payment.amount.toLocaleString('fr-FR')} FCFA
          </div>

          <div class="payment-details">
            <h3>Récapitulatif du bulletin</h3>
            <p><strong>Salaire brut:</strong> ${payslip.gross.toLocaleString('fr-FR')} FCFA</p>
            <p><strong>Déductions:</strong> ${payslip.deductions.toLocaleString('fr-FR')} FCFA</p>
            <p><strong>Net à payer:</strong> ${payslip.net.toLocaleString('fr-FR')} FCFA</p>
            <p><strong>Montant payé:</strong> ${payment.amount.toLocaleString('fr-FR')} FCFA</p>
          </div>

          <div class="signature">
            <div class="signature-line">
              Signature du caissier
            </div>
          </div>

          <div class="footer">
            <p>Ce document est généré automatiquement par le système de gestion des salaires.</p>
            <p>Date de génération: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();

      return pdfBuffer;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Impossible de générer le PDF');
    }
  }

  private static getPaymentMethodText(method: string): string {
    const methods: { [key: string]: string } = {
      'ESPECES': 'Espèces',
      'VIREMENT': 'Virement bancaire',
      'ORANGE_MONEY': 'Orange Money',
      'WAVE': 'Wave'
    };
    return methods[method] || method;
  }
}