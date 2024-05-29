import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items";

type InvoiceProps = {
    id?: Id;
    name: string;
    document: string;
    address: Address;
    items: InvoiceItems[],
    createdAt?: Date;
    updatedAt?: Date;
}


export default class Invoice extends BaseEntity {
    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: InvoiceItems[];

    constructor(props: InvoiceProps) {
        super(props.id);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items;
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }

    get items(): InvoiceItems[] {
        return this._items;
    }

    changeAddress(address: Address) {
        this._address = address;
    }

    total(){
        return this._items.reduce((total, item) => total + item.price, 0)
    }

}
