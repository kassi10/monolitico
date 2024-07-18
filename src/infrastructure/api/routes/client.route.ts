import express from "express";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";


export const clientRoute = express.Router()

clientRoute.post("/", async (req, res) =>  {
    const usecase = new AddClientUseCase(new ClientRepository())

    try {
        const clientInputDto = {
            
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            document: req.body.document
        }
        const output = await usecase.execute(clientInputDto)

        res.send(output)
    } catch (err) {
        res.status(500).send(err)
    }
})