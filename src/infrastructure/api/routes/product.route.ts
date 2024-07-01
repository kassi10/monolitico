import express, { Request, Response } from "express";
import ProductRepository from "../../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../../modules/product-adm/usecase/add-product/add-product.usecase";

export const productRoute = express.Router()


productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddProductUseCase(new ProductRepository())

    try {
        const productInputDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }

        const output = await usecase.execute(productInputDto);

        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
})