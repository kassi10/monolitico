import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<Invoice> {
        const invoiceModel: InvoiceModel = await InvoiceModel.create({
          id: invoice.id.id,
          name: invoice.name,
          document: invoice.document,
          street: invoice.address.street,
          city: invoice.address.city,
          number: invoice.address.number,
          state: invoice.address.state,
          complement: invoice.address.complement,
          zipCode: invoice.address.zipCode,
          items: invoice.items.map((item) => {
            return {
              name: item.name,
              price: item.price,
            };
          })
        });

        return new Invoice({
          id: new Id(invoiceModel.id),
          name: invoice.name,
          document: invoice.document,
          address: invoice.address,
          items: invoice.items
        });
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