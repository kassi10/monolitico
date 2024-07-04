

import express from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacade from "../../../modules/client-adm/facade/client-adm.facade";
import ProductAdmFacade from "../../../modules/product-adm/facade/product-adm.facade";
import StoreCatalogFacade from "../../../modules/store-catalog/facade/store-catalog.facade";


export const checkoutRoute = express.Router()

checkoutRoute.post("/", async (req, res) =>  {
    // const usecase = new PlaceOrderUseCase(
    //     new ClientAdmFacade(),
    //     new ProductAdmFacade(),
    //     new StoreCatalogFacade(),
    //     new 
    // )

    // try {
    //     const clientInputDto = {
    //         name: req.body.name,
    //         email: req.body.email,
    //         address: req.body.address
    //     }
    //     const output = await usecase.execute(clientInputDto)

    //     res.send(output)
    // } catch (err) {
    //     res.status(500).send(err)
    // }
})