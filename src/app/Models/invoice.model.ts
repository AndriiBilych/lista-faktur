import {InvoiceInterface} from "./Interfaces/invoice.interface";
import { v4 as uid} from "uuid";

export class InvoiceModel implements InvoiceInterface{
  id: number;
  uid: string
  contractor: string;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: string;

  constructor() {
    this.id = 0;
    this.uid = uid();
    this.contractor = 'New contractor';
    this.title = 'New title';
    this.comment = 'New comment';
    this.netto = 0;
    this.vat = 0;
    this.order = 0;
    const dateObj = new Date();
    const month = dateObj.getUTCMonth().toString();
    const day = dateObj.getDay().toString();
    this.date = `${dateObj.getUTCFullYear()}-${month.length > 1 ? month : '0' + month}-${day.length > 1 ? day : '0' + day}`;
  }

  deserialize(invoice: InvoiceInterface) {
    Object.assign(this, invoice);

    return this;
  }
}
