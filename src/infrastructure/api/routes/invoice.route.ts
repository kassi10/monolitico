import express from "express";
import FindInvoiceUseCase from "../../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import { FindInvoiceUseCaseInputDTO } from "../../../modules/invoice/usecase/find-invoice/find-invoice.dto";


export const invoiceRoute = express.Router()


invoiceRoute.get("/:id", async (req, res) => {
    const usecase = new FindInvoiceUseCase(new InvoiceRepository());

    try{
        const invoiceInputDto = {
            id: (req.params.id)
        }
        const output = await usecase.execute(invoiceInputDto)
        res.send(output)
    } catch (err) {
        res.status(500).send(err)
    }


})