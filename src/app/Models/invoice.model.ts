import {InvoiceInterface} from "./Interfaces/invoice.interface";

export class InvoiceModel implements InvoiceInterface{
  id: number;
  contractor: string;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: string;

  constructor() {
    this.id = 0;
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
}
