import { Sequelize } from "sequelize-typescript";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import ClientCheckoutModel from "./client.model";
import Order from "../domain/order.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import Client from "../domain/client.entity";
// import ProductCheckoutModel from "./product.model";


describe("OrderRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, OrderItemModel, ClientCheckoutModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an order", async () => {

        const orderRepository = new OrderRepository();


        ClientCheckoutModel.create({
            id: "4",
            name: "Client 1",
            email: "email 1",
            address: "address 1"
        });

        OrderModel.create(
            {
                id: "4",
                client_id: "4",
                status: "approved",
                
            }
        )

        OrderItemModel.create({
            id: "1",
            order_id: "4",
            name: "Product 1",
            description: "Product 1 description",
            salesprice: 100
        });
        OrderItemModel.create({
            id: "2",
            order_id: "4",
            name: "Product 2",
            description: "Product 2 description",
            salesprice: 200
        });

        const findOrder = await orderRepository.findOrder("4")

        expect(findOrder.id.id).toBeDefined();
        expect(findOrder.client.id.id).toEqual("4");
        expect(findOrder.status).toEqual("approved");
        expect(findOrder.products[0].id.id).toEqual("1");
        expect(findOrder.products[1].id.id).toEqual("2");

    });


    it("should add an order", async () => {

        const orderRepository = new OrderRepository();
        ClientCheckoutModel.create({
            id: "4",
            name: "Client 1",
            email: "email 1",
            address: "address 1"
        });

        const order = new Order(
            {
                id: new Id("5"),
                client: new Client({
                    id: new Id("4"),
                    name: "Client 1",
                    email: "email 1",
                    address: "address 1"
                }),
                status: "approved",
                products: [
                    new Product({
                        id: new Id("5"),
                        name: "Product 5",
                        description: "Product 5 description",
                        salesPrice: 500
                    })

                ]
            }
        )

        await orderRepository.addOrder(order);
        const output = await OrderModel.findOne({
            where: { id: "5" },
            include: ["client", "items"]
        })

        expect(output.client.id).toEqual("4");
        expect(output.client.name).toEqual("Client 1");
        expect(output.id).toEqual("5");
        expect(output.status).toEqual("approved");
        expect(output.items[0].id).toEqual("5");
        expect(output.items[0].name).toEqual("Product 5");
        expect(output.items[0].description).toEqual("Product 5 description");
        expect(output.items[0].salesprice).toEqual(500);


    })
})