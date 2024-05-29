import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import FindInvoiceUseCase from "./find-invoice.usecase";


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
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("Find Invoice usecase unit test", () => {
    it("should get stock of a product", async () => {
        const InvoiceRepository = MockRepository()

        const usecase = new FindInvoiceUseCase(InvoiceRepository);

        const output = await usecase.execute({ id: "1" });

        expect(output.id).toBe("1");
        expect(output.name).toBe("Invoice 1");
        expect(output.document).toBe("Document 1");
        expect(output.address.street).toBe("Street 1");
        expect(output.address.number).toBe("Number 1");
        expect(output.address.complement).toBe("Complement 1");
        expect(output.address.city).toBe("City 1");
        expect(output.address.state).toBe("State 1");
        expect(output.total).toBe(300);
        expect(output.address.zipCode).toBe("ZipCode 1");
        expect(output.items[0].id).toBe("1");
        expect(output.items[0].name).toBe("Item 1");
        expect(output.items[0].price).toBe(100);
        expect(output.items[1].id).toBe("2");
        expect(output.items[1].name).toBe("Item 2");
        expect(output.items[1].price).toBe(200);
    })

})