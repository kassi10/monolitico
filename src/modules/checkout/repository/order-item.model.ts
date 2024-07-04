import { Column, ForeignKey,BelongsTo, Model, PrimaryKey, Table, HasOne } from "sequelize-typescript";
import OrderModel from "./order.model";
// import ProductCheckoutModel from "./product.model";
@Table({
    tableName: "order_items",
    timestamps: false,
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    
    @BelongsTo(() => OrderModel)
    declare order: OrderModel;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    description: string;


    @Column({ allowNull: false })
    salesprice: number;


}