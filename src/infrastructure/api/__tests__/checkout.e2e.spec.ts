import { app } from "../express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../test-migrations/config-migrations/migrator";
import { ClientCheckoutModel } from "../../../modules/checkout/repository/client-checkout.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import ProductStoreCatalogModel from "../../../modules/store-catalog/repository/product.model";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe("E2E test for checkout", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;
    beforeEach(async () => {

        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([
            OrderModel,
            OrderItemModel,
            ClientCheckoutModel,
            ProductModel,
            // ProductStoreCatalogModel
        ])
        migration = migrator(sequelize)
        await migration.up()
        await sequelize.sync({ force: true });
    })

    afterAll(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })
    it("should create a checkout", async () => {
        // const client = {
        //     id: "1",
        //     name: "Client 1",
        //     email: "x@x.com",
        //     address: "Address 1",
        // };

        // const factoryClient = ClientAdmFacadeFactory.create();
        // await factoryClient.add(client);


        // const product1 = {
        //     id: "1",
        //     name: "Product 1",
        //     description: "Product 1 description",
        //     purchasePrice: 100,
        //     stock: 10
        // };

        // const product2 = {
        //     id: "2",
        //     name: "Product 2",
        //     description: "Product 2 description",
        //     purchasePrice: 200,
        //     stock: 20
        // };

        // const factoryProduct = ProductAdmFacadeFactory.create();
        // await factoryProduct.addProduct(product1);
        // await factoryProduct.addProduct(product2);

        // const response = await request(app).post("/checkout").send({
        //     client_id: "1",
        //     products: [
        //         {
        //             product_id: "1"
        //         },
        //         {
        //             product_id: "2"
        //         }
        //     ]
        // });
        // // // console.log(response)
        // expect(response.status).toBe(200);
        // // expect(response.body.total).toBeDefined();
        // // expect(response.body.products).toHaveLength(2);

        await ClientModel.create({
            id: "1",
            name: "Client 1",
            email: "client@example.com",
            address: "Address 1",
            document: "0000",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      
          await ProductModel.create({
            id: "1",
            name: "My Product",
            description: "Product description",
            purchasePrice: 100,
            // salesPrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      
          await ProductModel.create({
            id: "2",
            name: "My Product 2",
            description: "Product description",
            purchasePrice: 25,
            // salesPrice: 25,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      
          const response = await request(app)
            .post("/checkout")
            .send({
              clientId: "1",
              products: [{ productId: "1" }, { productId: "2" }],
            });
      
          expect(response.status).toEqual(200);
          expect(response.body.id).toBeDefined();
          expect(response.body.invoiceId).toBeDefined();
          expect(response.body.total).toEqual(125);
          expect(response.body.status).toEqual("approved");
    })

})