import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    modelName: 'client-checkout-table',
    tableName: 'clients',
    timestamps: false,
})

export class ClientCheckoutModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false })
    email: string;

    @Column({ allowNull: false })
    address: string;

    @Column({ allowNull: true })
    createdAt: Date;
  
    @Column({ allowNull: true })
    updatedAt: Date;
}