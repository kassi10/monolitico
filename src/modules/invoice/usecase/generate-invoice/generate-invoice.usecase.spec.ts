import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";


const item1 = new InvoiceItems({
    id: new Id("1"),
    name: "Item 1",
    price: 100,
});

const item2 = new InvoiceItems({
    id: new Id("2"),
    name: "Item 2",
    price: 200,
});


const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document: "Document 1",
    address: new Address(
        "Street 1",
        "Number 1",
        "Complement 1",
        "City 1",
        "State 1",
        "ZipCode 1",
    ),
    items: [item1, item2]
});

const MockRepository = () => {
    return {
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("Generate Invoice usecase unit test", () => {
    it("should generate an invoice", async () => {
        const InvoiceRepository = MockRepository()

        const usecase = new GenerateInvoiceUseCase(InvoiceRepository);

        const output = await usecase.execute({
            name: "Invoice 1",
            document: "Document 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "ZipCode 1",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 200
                }
            ]
        });

        expect(output.items.length).toBe(2);
        expect(output.total).toBe(300);
        expect(output.name).toBe('Invoice 1');
        expect(output.document).toBe('Document 1');
        expect(output.street).toBe('Street 1');
        expect(output.number).toBe('Number 1');
        expect(output.complement).toBe('Complement 1');
        expect(output.city).toBe('City 1');
        expect(output.state).toBe('State 1');
        expect(output.zipCode).toBe('ZipCode 1');

    })

})