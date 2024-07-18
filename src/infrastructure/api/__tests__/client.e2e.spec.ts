import { app, sequelize } from '../express'
import request from 'supertest'
describe("E2E test for client", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    })

    afterAll(async () => {
        await sequelize.close()
    })
    it("should create a client", async () => {
        const response = await request(app).post("/clients").send({
            name: "Client 1",
            email: "x@x.com",
            address: "Address 1",
            document: "Document 1"
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Client 1");
        expect(response.body.email).toBe("x@x.com");
        expect(response.body.address).toBe("Address 1");
        expect(response.body.document).toBe("Document 1");
    })

})