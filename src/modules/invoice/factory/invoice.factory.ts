import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";


export default class InvoiceFacadeFactory {
    static create(): InvoiceFacade {
        const invoiceRepository = new InvoiceRepository();
        const invoiceFindUseCase = new FindInvoiceUseCase(invoiceRepository);
        // const invoiceGenerateUseCase = new GenetareInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            find: invoiceFindUseCase,
            generate: undefined
        });

        
        return invoiceFacade;
    }
}
