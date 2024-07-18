import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ClientCheckoutModel } from "../../modules/checkout/repository/client-checkout.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";
import { Umzug } from "umzug"
import { migrator } from "../../test-migrations/config-migrations/migrator";
import ProductStoreCatalogModel from "../../modules/store-catalog/repository/product.model";

export const app: Express = express()

app.use(express.json());
app.use('/products', productRoute)
app.use('/clients', clientRoute)
app.use('/checkout', checkoutRoute)

 export let sequelize: Sequelize;

async function setupDatabase() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
      });

      let migration: Umzug<any>;
      await sequelize.addModels([
        
        ProductModel, 
        ClientModel, 
        // ProductStoreModel, 
        // TransactionModel,
        OrderModel,
        OrderItemModel,
        ClientCheckoutModel,
        ProductStoreCatalogModel
        // ProductOrder,
        // InvoiceItemModel
        ]);
        migration = migrator(sequelize)
        await migration.up()

    // sequelize.addModels([ProductModel]);
    // let migration: Umzug<any>;
    // migration = migrator(sequelize)
    // await migration.up()
}

setupDatabase();
