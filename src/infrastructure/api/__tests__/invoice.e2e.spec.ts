import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";

import request from 'supertest'
import { app } from "../express";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import { Sequelize } from "sequelize-typescript"
import { Umzug } from "umzug"
import { migrator } from "../../../test-migrations/config-migrations/migrator";
describe('invoice', () => {

    let sequelize: Sequelize
    let migration: Umzug<any>;
    beforeEach(async () => {
  
      let sequelize: Sequelize
      let migration: Umzug<any>;
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false
      })
  
      sequelize.addModels([
        InvoiceItemModel,
        InvoiceModel,
      ])
      migration = migrator(sequelize)
      await migration.up()
      await sequelize.sync();
  
    })
  
    afterAll(async () => {
      if (!migration || !sequelize) {
        return
      }
      // migration = migrator(sequelize)
      // await migration.down()
      await sequelize.close()
    })
    it('should find an invoice', async () => {

        const input1 = {
            id: "10",
            name: "Kassi",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "6",
                    name: "Item 1",
                    price: 800
                },
                {
                    id: "7",
                    name: "Item 2",
                    price: 500
                }
            ]
        }


        const invoiceFacade = InvoiceFacadeFactory.create();
        const output = await invoiceFacade.generate(input1);


        const response = await request(app).get(`/invoice/${output.id}`);


        expect(response.status).toBe(200);
        expect(response.body.name).toEqual('Kassi');
        expect(response.body.document).toEqual('1234-5678');
        expect(response.body.address.street).toEqual('Rua 123');
        expect(response.body.address.number).toEqual('99');
        expect(response.body.address.complement).toEqual('Casa Verde');
        expect(response.body.address.city).toEqual('Criciúma');
        expect(response.body.address.state).toEqual('SC');
        expect(response.body.address.zipCode).toEqual('88888-888');
        expect(response.body.items[0].id).toBeDefined();
        expect(response.body.items[0].name).toEqual('Item 1');
        expect(response.body.items[0].price).toEqual(800);
        // expect(response.body.items[1].id).toBeDefined();
        expect(response.body.items[1].name).toEqual('Item 2');
        expect(response.body.items[1].price).toEqual(500);
        expect(response.body.total).toEqual(1300);


    })
});