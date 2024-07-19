import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.factory";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });

        await sequelize.addModels([InvoiceItemModel, InvoiceModel]);
        await sequelize.sync({force: true});
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
        
        const invoiceFacade = InvoiceFacadeFactory.create();
        const invoice = await invoiceFacade.generate(input);
        const output = await invoiceFacade.find({ id: input.id });

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
        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toBe(input.items[0].id);
        expect(output.items[0].name).toBe(input.items[0].name);
        expect(output.items[0].price).toBe(input.items[0].price);

    });

    it('should generate an invoice', async () => {
        const input1 = {
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

        const invoiceFacade = InvoiceFacadeFactory.create();
        const output = await invoiceFacade.generate(input1);

        expect(output).toBeDefined();
        expect(output.name).toBe(input1.name);
        expect(output.document).toBe(input1.document);
        expect(output.street).toBe(input1.street);
        expect(output.number).toBe(input1.number);
        expect(output.complement).toBe(input1.complement);
        expect(output.city).toBe(input1.city);
        expect(output.state).toBe(input1.state);
        expect(output.zipCode).toBe(input1.zipCode);
        expect(output.items.length).toBe(2);
        expect(output.items[0].id).toBe(input1.items[0].id);
        expect(output.items[0].name).toBe(input1.items[0].name);
        expect(output.items[0].price).toBe(input1.items[0].price);
        expect(output.items[1].id).toBe(input1.items[1].id);
        expect(output.items[1].name).toBe(input1.items[1].name);
        expect(output.items[1].price).toBe(input1.items[1].price);
    })
})