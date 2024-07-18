import ClientAdmFacadeFactory from "../../../client-adm/factory/facade.factory"
import { ClientModel } from "../../../client-adm/repository/client.model"
import InvoiceFacadeFactory from "../../../invoice/factory/invoice.factory"
import InvoiceItemModel from "../../../invoice/repository/invoice-item.model"
import InvoiceModel from "../../../invoice/repository/invoice.model"
import PaymentFacadeFactory from "../../../payment/factory/payment.facade.factory"
import TransactionModel from "../../../payment/repository/transaction.model"
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory"
import { ProductModel } from "../../../product-adm/repository/product.model"
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory"
import ProductStoreCatalogModel from "../../../store-catalog/repository/product.model"
import { ClientCheckoutModel } from "../../repository/client-checkout.model"
import OrderItemModel from "../../repository/order-item.model"
import OrderModel from "../../repository/order.model"
import OrderRepository from "../../repository/order.repository"
import { PlaceOrderInputDto } from "./place-order.dto"
import PlaceOrderUseCase from "./place-order.usecase"
import { Sequelize } from "sequelize-typescript"
import { Umzug } from "umzug"
import { migrator } from "../../../../test-migrations/config-migrations/migrator";
describe("PlaceOrderUseCase unit test", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;

    beforeEach(async() => {
        jest.clearAllMocks();
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
          })
      
          sequelize.addModels([
            OrderModel,
            OrderItemModel,
            ClientModel,
            ClientCheckoutModel,
            ProductModel,
            TransactionModel,
            InvoiceItemModel,
            InvoiceModel,
            ProductStoreCatalogModel
          ])
          migration = migrator(sequelize)
          await migration.up()
          await sequelize.sync();
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return 
          }
        //   migration = migrator(sequelize)
        //   await migration.down()
          await sequelize.close()
    })
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

        it("should place an order", async () => {
           

            const client = {
                id: "1",
                name: "Client 1",
                email: "x@x.com",
                address: "Address 1",
                document: "Document 1"
              };
          
              const factoryClient = ClientAdmFacadeFactory.create();
              await factoryClient.add(client);
          
          
              const product1 = {
                id: "1",
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 100,
                salesPrice: 200,
                stock: 10
              };
          
              const product2 = {
                id: "2",
                name: "Product 2",
                description: "Product 2 description",
                purchasePrice: 200,
                salesPrice: 300,
                stock: 20
              };
          
              const factoryProduct = ProductAdmFacadeFactory.create();
              await factoryProduct.addProduct(product1);
              await factoryProduct.addProduct(product2);
              
              const clientFacade = ClientAdmFacadeFactory.create()
              const productFacade = ProductAdmFacadeFactory.create()
              const storeCatalog = StoreCatalogFacadeFactory.create()
              const paymentFacade = PaymentFacadeFactory.create()
              const invoiceFacade = InvoiceFacadeFactory.create()

              const usecase = new PlaceOrderUseCase(
                clientFacade,
                productFacade,
                storeCatalog,
                invoiceFacade,
                paymentFacade,
                new OrderRepository()
            )

              const inputDto = {
                clientId: client.id,
                products: [
                    {
                        productId: product1.id
                    },
                    {
                        productId: product2.id
                    }
                ]
            }
            const output = await usecase.execute(inputDto)

            expect(output.total).toEqual(500)
            expect(output.products).toHaveLength(2)
            expect(output.products[0].productId).toEqual(product1.id)
            expect(output.products[1].productId).toEqual(product2.id)
            
        })

    })
})