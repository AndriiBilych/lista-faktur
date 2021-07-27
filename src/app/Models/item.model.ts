import {ItemInterface} from "./Interfaces/item.interface";
import { v4 as uid} from "uuid";

export class ItemModel implements ItemInterface{
  id: number;
  uid: string;
  description: string;
  netto: number;
  vat: number;

  constructor(id?: number, uniqueId?: string, description?: string, netto?: number, vat?: number) {
    this.id = id ?? 0;
    this.uid = uniqueId ?? uid();
    this.description = description ?? 'New description';
    this.netto = netto ?? 0;
    this.vat = vat ?? 0;
  }

  deserialize(invoice: ItemInterface) {
    return Object.assign(this, invoice);;
  }
}
