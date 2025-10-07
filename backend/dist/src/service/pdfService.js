"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
class PDFService {
    static async generateInvoicePDF(paymentData) {
        var _a;
        const { payment, payslip, employee, company, cashier } = paymentData;
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reçu de paiement</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 10px;
            color: #333;
            background: white;
            font-size: 14px;
            line-height: 1.3;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            padding: 15px;
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid ${company.color || '#6FA4AF'};
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .company-logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 8px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: ${company.color || '#6FA4AF'};
            margin: 3px 0;
          }
          .receipt-title {
            font-size: 18px;
            color: #666;
            margin: 3px 0;
            font-weight: bold;
          }
          .receipt-number {
            font-size: 16px;
            font-weight: bold;
            color: ${company.color || '#6FA4AF'};
            margin: 3px 0;
          }
          .main-content {
            flex: 1;
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }
          .left-section, .right-section {
            flex: 1;
          }
          .section-title {
            font-size: 15px;
            color: ${company.color || '#6FA4AF'};
            font-weight: bold;
            margin-bottom: 6px;
            border-bottom: 1px solid #eee;
            padding-bottom: 2px;
          }
          .info-row {
            margin: 2px 0;
            display: flex;
          }
          .info-label {
            font-weight: bold;
            min-width: 90px;
          }
          .info-value {
            flex: 1;
          }
          .payment-summary {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            margin: 12px 0;
            border-left: 3px solid ${company.color || '#6FA4AF'};
          }
          .final-amount {
            position: fixed;
            bottom: 100px;
            left: 15px;
            right: 15px;
            background: ${company.color || '#6FA4AF'};
            color: white;
            padding: 18px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .signatures {
            position: fixed;
            bottom: 15px;
            left: 15px;
            right: 15px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            flex: 1;
            text-align: center;
            margin: 0 8px;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 30px;
            padding-top: 3px;
            font-size: 12px;
            font-weight: bold;
          }
          .cashier-info {
            background: #e8f4f8;
            padding: 6px;
            border-radius: 4px;
            margin: 8px 0;
            font-size: 13px;
          }
          .footer {
            position: fixed;
            bottom: 3px;
            left: 15px;
            right: 15px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #eee;
            padding-top: 3px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            ${company.logo ? `<img src="${company.logo}" alt="${company.name}" class="company-logo">` : ''}
            <div class="company-name">${company.name}</div>
            <div class="receipt-title">REÇU DE PAIEMENT</div>
            <div class="receipt-number">N° ${payment.id.slice(-8).toUpperCase()}</div>
          </div>

          <!-- Main Content -->
          <div class="main-content">
            <!-- Left Section -->
            <div class="left-section">
              <div class="section-title">INFORMATIONS EMPLOYEUR</div>
              <div class="info-row"><span class="info-label">Entreprise:</span><span class="info-value">${company.name}</span></div>
              ${company.address ? `<div class="info-row"><span class="info-label">Adresse:</span><span class="info-value">${company.address}</span></div>` : ''}
              ${company.phone ? `<div class="info-row"><span class="info-label">Téléphone:</span><span class="info-value">${company.phone}</span></div>` : ''}
              ${company.email ? `<div class="info-row"><span class="info-label">Email:</span><span class="info-value">${company.email}</span></div>` : ''}

              <div class="section-title" style="margin-top: 15px;">INFORMATIONS EMPLOYE</div>
              <div class="info-row"><span class="info-label">Nom:</span><span class="info-value">${employee.firstName} ${employee.lastName}</span></div>
              <div class="info-row"><span class="info-label">Poste:</span><span class="info-value">${employee.position}</span></div>
              <div class="info-row"><span class="info-label">Contrat:</span><span class="info-value">${employee.contractType}</span></div>
            </div>

            <!-- Right Section -->
            <div class="right-section">
              <div class="section-title">DÉTAILS DU PAIEMENT</div>
              <div class="info-row"><span class="info-label">Date:</span><span class="info-value">${new Date(payment.date).toLocaleDateString('fr-FR')}</span></div>
              <div class="info-row"><span class="info-label">Période:</span><span class="info-value">${((_a = payslip.payRun) === null || _a === void 0 ? void 0 : _a.period) || 'N/A'}</span></div>
              <div class="info-row"><span class="info-label">Méthode:</span><span class="info-value">${this.getPaymentMethodText(payment.method)}</span></div>
              <div class="info-row"><span class="info-label">Référence:</span><span class="info-value">${payment.id.slice(-8)}</span></div>

              <!-- Cashier Info -->
              ${cashier ? `
              <div class="cashier-info">
                <div class="section-title" style="margin-bottom: 3px;">CAISSIER</div>
                <div class="info-row" style="margin: 1px 0;"><span class="info-label" style="min-width: 70px;">Nom:</span><span class="info-value">${cashier.email.split('@')[0]}</span></div>
                <div class="info-row" style="margin: 1px 0;"><span class="info-label" style="min-width: 70px;">Email:</span><span class="info-value">${cashier.email}</span></div>
              </div>
              ` : ''}

              <!-- Payment Summary -->
              <div class="payment-summary">
                <div class="section-title" style="margin-bottom: 8px;">RÉCAPITULATIF</div>
                <div class="info-row"><span class="info-label">Salaire brut:</span><span class="info-value">${payslip.gross.toLocaleString('fr-FR')} FCFA</span></div>
                <div class="info-row"><span class="info-label">Déductions:</span><span class="info-value">${payslip.deductions.toLocaleString('fr-FR')} FCFA</span></div>
                <div class="info-row" style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 3px; margin-top: 3px;"><span class="info-label">Net à payer:</span><span class="info-value">${payslip.net.toLocaleString('fr-FR')} FCFA</span></div>
                <div class="info-row" style="font-weight: bold; color: ${company.color || '#6FA4AF'};"><span class="info-label">Montant payé:</span><span class="info-value">${payment.amount.toLocaleString('fr-FR')} FCFA</span></div>
              </div>
            </div>
          </div>

          <!-- Final Amount (Fixed at bottom) -->
          <div class="final-amount">
            MONTANT PAYÉ: ${payment.amount.toLocaleString('fr-FR')} FCFA
          </div>

          <!-- Signatures -->
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line">
                Signature de l'entreprise
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                Signature du bénéficiaire<br/>
                (reçu de paiement)
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            Généré le ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </body>
      </html>
    `;
        try {
            const browser = await puppeteer_1.default.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '5px',
                    right: '10px',
                    bottom: '70px', // Espace pour les signatures en bas
                    left: '10px'
                },
                preferCSSPageSize: true,
                displayHeaderFooter: false,
                pageRanges: '1' // Forcer une seule page
            });
            await browser.close();
            return pdfBuffer;
        }
        catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw new Error('Impossible de générer le PDF');
        }
    }
    static getPaymentMethodText(method) {
        const methods = {
            'ESPECES': 'Espèces',
            'VIREMENT': 'Virement bancaire',
            'ORANGE_MONEY': 'Orange Money',
            'WAVE': 'Wave'
        };
        return methods[method] || method;
    }
}
exports.PDFService = PDFService;
//# sourceMappingURL=pdfService.js.map