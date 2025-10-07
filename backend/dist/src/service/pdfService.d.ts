export declare class PDFService {
    static generateInvoicePDF(paymentData: {
        payment: any;
        payslip: any;
        employee: any;
        company: any;
        cashier?: any;
    }): Promise<Uint8Array<ArrayBufferLike>>;
    private static getPaymentMethodText;
}
//# sourceMappingURL=pdfService.d.ts.map