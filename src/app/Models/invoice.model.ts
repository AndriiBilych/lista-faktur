import {InvoiceInterface} from "./Interfaces/invoice.interface";
import { v4 as uid} from "uuid";
import {ItemModel} from "./item.model";

export class InvoiceModel implements InvoiceInterface{
  id: number;
  uid: string;
  contractor: string;
  title: string;
  comment: string;
  date: string;
  items: ItemModel[];

  constructor(id?: number, uniqueId?: string, contractor?: string, title?: string, comment?: string, date?: string,) {
    this.id = id ?? 0;
    this.uid = uniqueId ?? uid();
    this.contractor = contractor ?? 'New contractor';
    this.title = title ?? 'New title';
    this.comment = comment ?? 'New comment';
    const dateObj = new Date();
    const month = dateObj.getUTCMonth().toString();
    const day = dateObj.getDay().toString();
    this.date = date ?? `${dateObj.getUTCFullYear()}-${month.length > 1 ? month : '0' + month}-${day.length > 1 ? day : '0' + day}`;
    this.items = [];
  }

  deserialize(invoice: InvoiceInterface) {
    Object.assign(this, invoice);

    this.items = this.items.map((item) => new ItemModel().deserialize(item));

    return this;
  }
}
