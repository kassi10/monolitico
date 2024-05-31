import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "./invoice.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {

        const invoiceRepository = new InvoiceRepository();
    
        await InvoiceModel.create(
            {
                id: "4",
                name: "Invoice 1",
                document: "Invoice 1 document",
                street: "Invoice 1 street",
                number: "1",
                complement: "Invoice 1 complement",
                city: "Invoice 1 city",
                state: "Invoice 1 state",
                zipCode: "Invoice 1 zipCode",
            }
        )

        InvoiceItemModel.create(
            {
                id: "1",
                invoice_id: "4",
                name: "Invoice 1 item 1",
                price: 100,
            }
        );
        InvoiceItemModel.create(
            {
                id: "2",
                invoice_id: "4",
                name: "Invoice 2 item 2",
                price: 200,
            }
        );

        const findInvoice = await invoiceRepository.find("4")

        expect(findInvoice.id).toBeDefined();
        expect(findInvoice.name).toEqual("Invoice 1");
        expect(findInvoice.document).toEqual("Invoice 1 document");
        expect(findInvoice.address.street).toEqual("Invoice 1 street");
        expect(findInvoice.address.number).toEqual("1");
        expect(findInvoice.address.complement).toEqual("Invoice 1 complement");
        expect(findInvoice.address.city).toEqual("Invoice 1 city");
        expect(findInvoice.address.state).toEqual("Invoice 1 state");
        expect(findInvoice.address.zipCode).toEqual("Invoice 1 zipCode");
        expect(findInvoice.items[0].id.id).toEqual("1");
        expect(findInvoice.items[0].name).toEqual("Invoice 1 item 1");
        expect(findInvoice.items[0].price).toEqual(100);
        expect(findInvoice.items[1].id.id).toEqual("2");
        expect(findInvoice.items[1].name).toEqual("Invoice 2 item 2");
        expect(findInvoice.items[1].price).toEqual(200);

    })

    it("should generate an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();
        const invoice = new Invoice({
            id: new Id("7"),
            name: "Invoice 1",
            document: "Invoice 1 document",
            address: new Address(
                "Invoice 1 street",
                "1",
                "Invoice 1 complement",
                "Invoice 1 city",
                "Invoice 1 state",
                "Invoice 1 zipCode",
            ),
            items: [
                new InvoiceItems({
                    id: new Id("1"),
                    name: "Invoice 1 item 1",
                    price: 100
                }),
                new InvoiceItems({
                    id: new Id("2"),
                    name: "Invoice 2 item 2",
                    price: 200
                })
            ]
        });

        const output = await invoiceRepository.generate(invoice);
        
        expect(output.id).toBeDefined();
        expect(output.name).toEqual("Invoice 1");
        expect(output.document).toEqual("Invoice 1 document");
        expect(output.address.street).toEqual("Invoice 1 street");
        expect(output.address.number).toEqual("1");
        expect(output.address.complement).toEqual("Invoice 1 complement");
    })
})