import { Column, Model, PrimaryKey, Table, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import OrderItemModel from "./order-item.model";
import { ClientCheckoutModel } from "./client-checkout.model";
import InvoiceModel from "../../invoice/repository/invoice.model";

@Table({
    tableName: "orders",
    timestamps: false,
})

export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @BelongsTo(() => ClientCheckoutModel)
    declare client: ClientCheckoutModel;

    @ForeignKey(() => ClientCheckoutModel)
    @Column({ allowNull: false })
    client_id: string;

    @Column({ allowNull: false })
    status: string;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

    @Column({ allowNull: true })
    invoiceId: string;
}