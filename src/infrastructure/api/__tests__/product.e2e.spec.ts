import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { app } from "../express";
import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import { Umzug } from "umzug"
import { migrator } from "../../../test-migrations/config-migrations/migrator";
debugger

describe("E2E test for product", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
          })
          
        sequelize.addModels([ProductModel])
        migration = migrator(sequelize)
        await migration.up()
        await sequelize.sync();
    })

    afterAll(async () => {
        if (!migration || !sequelize) {
            return 
          }
        //   migration = migrator(sequelize)
        //   await migration.down()
          await sequelize.close()
    })

    it("should create a product", async () => {
        const response = await request(app).post("/products").send({
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            salesPrice: 200,
            stock: 10
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.description).toBe("Product 1 description");
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.salesPrice).toBe(200);
        expect(response.body.stock).toBe(10);
    })

    it("should not create a product", async () => {
        const response = await request(app).post("/products").send({
            name: null,
            description: "Product 1 description",
            purchasePrice: 100,
            salesPrice: 200,
            stock: 10
        });

        expect(response.status).toBe(500);
    })
})