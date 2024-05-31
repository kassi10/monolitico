import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";


export default class InvoiceFacadeFactory {
    static create(): InvoiceFacade {
        const invoiceRepository = new InvoiceRepository();
        const invoiceFindUseCase = new FindInvoiceUseCase(invoiceRepository);
        const invoiceGenerateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            findUseCase: invoiceFindUseCase,
            generateUseCase: invoiceGenerateUseCase
        });

        
        return invoiceFacade;
    }
}
