
// import { Column, Model, PrimaryKey, Table, HasMany, BelongsTo } from "sequelize-typescript";
// import OrderItemModel from "./order-item.model";

// @Table({
//     modelName: 'product-checkout-table',
//     tableName: 'products',
//     timestamps: false,
// })

// export default class ProductCheckoutModel extends Model {
//     @PrimaryKey
//     @Column({ allowNull: false })
//     id: string;

//     @Column({ allowNull: false })
//     name: string;

//     @Column({ allowNull: false })
//     description: string;

//     @Column({ allowNull: false })
//     salesprice: string;

//     @HasMany(() => OrderItemModel)
//     declare orders: OrderItemModel;
// }