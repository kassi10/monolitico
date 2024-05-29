import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.factory";
describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceItemModel, InvoiceModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {

        const input = {
            id: "10",
            name: "Kassi",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "6",
                    name: "Item 1",
                    price: 800
                },
                {
                    id: "7",
                    name: "Item 2",
                    price: 500
                }
            ]
        }
        await InvoiceModel.create(
            {
                id: input.id,
                name: input.name,
                document: input.document,
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode
            }
        )

        InvoiceItemModel.create(
            {
                id: input.items[0].id,
                invoice_id: input.id,
                name: input.items[0].name,
                price: input.items[0].price
            }
        );

        const invoiceFacade = InvoiceFacadeFactory.create();
        await invoiceFacade.find({ id: input.id });
        const output = await invoiceFacade.find(input);

        console.log(output)
        expect(output).toBeDefined();
        expect(output.id).toBe(input.id);
        expect(output.name).toBe(input.name);
        expect(output.document).toBe(input.document);
        expect(output.street).toBe(input.street);
        expect(output.number).toBe(input.number);
        expect(output.complement).toBe(input.complement);
        expect(output.city).toBe(input.city);
        expect(output.state).toBe(input.state);
        expect(output.zipCode).toBe(input.zipCode);
        expect(output.items.length).toBe(1);
        expect(output.items[0].id).toBe(input.items[0].id);
        expect(output.items[0].name).toBe(input.items[0].name);
        expect(output.items[0].price).toBe(input.items[0].price);

    });
})