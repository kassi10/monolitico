

import express from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import OrderRepository from "../../../modules/checkout/repository/order.repository";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.factory";


export const checkoutRoute = express.Router()

checkoutRoute.post("/", async (req, res) =>  {

    const clientFacade = ClientAdmFacadeFactory.create()
    const productFacade = ProductAdmFacadeFactory.create()
    const storeCatalog = StoreCatalogFacadeFactory.create()
    const paymentFacade = PaymentFacadeFactory.create()
    const invoiceFacade = InvoiceFacadeFactory.create()

    const usecase = new PlaceOrderUseCase(
        clientFacade,
        productFacade,
        storeCatalog,
        invoiceFacade,
        paymentFacade,
        new OrderRepository()
    )

    try {
        const inputDto = {
            clientId: req.body.client_id,
            products: req.body.products.map((p:any) => {
                return { productId: p.product_id }
            })
        }
        const output = await usecase.execute(inputDto)

        res.send(output)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})