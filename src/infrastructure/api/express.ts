import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { ClientModel } from "../../modules/client-adm/repository/client.model";

export const app: Express = express()

app.use(express.json());
app.use('/products', productRoute)
app.use('/clients', clientRoute)

export let sequelize: Sequelize;

async function setupDatabase() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });

    await sequelize.addModels([ProductModel, ClientModel]);
    await sequelize.sync()
}

setupDatabase();
