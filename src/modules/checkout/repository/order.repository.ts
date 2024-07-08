import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import Product from "../domain/product.entity";
import OrderItemModel from "./order-item.model";
export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        
        const newOrder = await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            status: order.status,
        });
    
        // Criar os itens do pedido e associá-los ao pedido principal
        const orderItems = order.products.map((product) => ({
            id: product.id.id,
            order_id: newOrder.id,
            name: product.name,
            description: product.description,
            salesprice: product.salesPrice,
        }));

        try{
            await OrderItemModel.bulkCreate(orderItems);

        } catch (error) {
            // console.log(error)
        }
    
    }
    async findOrder(id: string): Promise<Order> {
        const orderModel: OrderModel = await OrderModel.findOne({
            where: { id },
            include: ["client", "items"],
        });

        // console.log(orderModel)
        return new Order({
            id: new Id(id),
            client: new Client({
                id: new Id(orderModel.client.id),
                name: orderModel.client.name,
                email: orderModel.client.email,
                address: orderModel.client.address
            }),
            status: orderModel.status,
            products: orderModel.items.map((item) => {
                return new Product({
                    id: new Id(item.id),
                    name: item.name,
                    description: item.description,
                    salesPrice: item.salesprice
                });
            }),
        });


    };
}