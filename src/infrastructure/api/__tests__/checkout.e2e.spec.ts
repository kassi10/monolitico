import { app } from "../express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../../../test-migrations/config-migrations/migrator";
import { ClientCheckoutModel } from "../../../modules/checkout/repository/client-checkout.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import OrderItemModel from "../../../modules/checkout/repository/order-item.model";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import ProductStoreCatalogModel from "../../../modules/store-catalog/repository/product.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize
  let migration: Umzug<any>;
  beforeEach(async () => {

    let sequelize: Sequelize
    let migration: Umzug<any>;
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

  afterAll(async () => {
    if (!migration || !sequelize) {
      return
    }
    // migration = migrator(sequelize)
    // await migration.down()
    await sequelize.close()
  })
  it("should create a checkout", async () => {
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
      salesPrice: 600,
      stock: 20
    };

    const factoryProduct = ProductAdmFacadeFactory.create();
    await factoryProduct.addProduct(product1);
    await factoryProduct.addProduct(product2);

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

    // try {
    const response = await request(app)
      .post("/checkout")
      .send(inputDto);

      console.log(response.body)
    // expect(response.status).toEqual(200);
    // expect(response.body.id).toBeDefined();
    // expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toEqual(800);
    expect(response.body.status).toEqual("approved");

    // } catch (err) {
    //   console.log(err)
    // }


  })

})