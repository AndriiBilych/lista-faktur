import {InvoiceInterface} from "./Interfaces/invoice.interface";
import { v4 as uid} from "uuid";

export class InvoiceModel implements InvoiceInterface{
  id: number;
  uid: string;
  contractor: string;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: string;

  constructor(id?: number, uniqueId?: string, contractor?: string, title?: string, comment?: string, netto?: number, vat?: number, order?: number, date?: string,) {
    this.id = id ?? 0;
    this.uid = uniqueId ?? uid();
    this.contractor = contractor ?? 'New contractor';
    this.title = title ?? 'New title';
    this.comment = comment ?? 'New comment';
    this.netto = netto ?? 0;
    this.vat = vat ?? 0;
    this.order = order ?? 0;
    const dateObj = new Date();
    const month = dateObj.getUTCMonth().toString();
    const day = dateObj.getDay().toString();
    this.date = date ?? `${dateObj.getUTCFullYear()}-${month.length > 1 ? month : '0' + month}-${day.length > 1 ? day : '0' + day}`;
  }

  deserialize(invoice: InvoiceInterface) {
    Object.assign(this, invoice);

    return this;
  }
}
