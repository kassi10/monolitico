import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";


export interface UseCasesProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
}
export default class InvoiceFacade implements InvoiceFacadeInterface {


    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;
    constructor(useCasesProps: UseCasesProps) {
        this._findUsecase = useCasesProps.findUseCase;
        this._generateUsecase = useCasesProps.generateUseCase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        const result = await this._generateUsecase.execute(input);
        return {
            id: result.id,
            name: result.name,
            document: result.document,
            street: result.street,
            number: result.number,
            complement: result.complement,
            city: result.city,
            state: result.state,
            zipCode: result.zipCode,
            items: result.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            }))
        }

    }
    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        const result = await this._findUsecase.execute(input);

        return {
            id: result.id,
            name: result.name,
            document: result.document,
            street: result.address.street,
            number: result.address.number,
            complement: result.address.complement,
            city: result.address.city,
            state: result.address.state,
            zipCode: result.address.zipCode,
            items: result.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
        }
    }

}