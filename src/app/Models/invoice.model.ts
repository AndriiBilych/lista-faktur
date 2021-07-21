import {InvoiceInterface} from "./Interfaces/invoice.interface";

export class InvoiceModel implements InvoiceInterface{
  id: number;
  uniqueNumber: number;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: Date;

  constructor() {
    this.id = 0;
    this.uniqueNumber = 0;
    this.title = '';
    this.comment = '';
    this.netto = 0;
    this.vat = 0;
    this.order = 0;
    this.date = new Date();
  }
}
