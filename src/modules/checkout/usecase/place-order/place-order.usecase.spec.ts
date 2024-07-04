import { PlaceOrderInputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase"

describe("PlaceOrderUseCase unit test", () => {

    describe("execute method", () => {
        it("should throw an error when client is not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            // @ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase();
            // @ts-expect-error
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: []
            }
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Client not found");
        })

        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            }

            // @ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
                // @ts-expect-error
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-expect-error
                .mockRejectedValue(new Error("No products selected"));

            // @ts-expect-error
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("No products selected");
            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        })

    })
})