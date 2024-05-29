import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";


export interface UseCasesProps {
    find: UseCaseInterface;
    generate: UseCaseInterface;
  }
export default class InvoiceFacade implements InvoiceFacadeInterface {


    private _findUsecase: UseCaseInterface;
    private _generateUsecase: UseCaseInterface;
    constructor(private useCasesProps: UseCasesProps) {
        this._findUsecase = useCasesProps.find;
        this._generateUsecase = useCasesProps.generate;
    }

    generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
        throw new Error("Method not implemented.");
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