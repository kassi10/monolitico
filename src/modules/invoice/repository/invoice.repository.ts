import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    generate(invoice: Invoice): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async find(id: string): Promise<Invoice> {
        const invoiceModel: InvoiceModel = await InvoiceModel.findOne({
            where: { id },
            include: ["items"],
          });

          return new Invoice({
            id: new Id(id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address(
              invoiceModel.street,
              invoiceModel.number,
              invoiceModel.complement,
              invoiceModel.city,
              invoiceModel.state,
              invoiceModel.zipCode,
            ),
            items: invoiceModel.items.map((item) => {
              return new InvoiceItems({
                id: new Id(item.id),
                name: item.name,
                price: item.price,

              });
            }),
          });
    }
}