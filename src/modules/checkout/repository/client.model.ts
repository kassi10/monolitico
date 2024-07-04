import { Column, Model, PrimaryKey, Table, HasMany, BelongsTo } from "sequelize-typescript";

@Table({
    modelName: 'client-checkout-table',
    tableName: 'clients',
    timestamps: false,
})

export default class ClientCheckoutModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    email: string;

    @Column({ allowNull: false })
    address: string;
}