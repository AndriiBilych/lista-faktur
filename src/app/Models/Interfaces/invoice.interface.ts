export interface InvoiceInterface {
  id: number;
  uniqueNumber: number;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: Date;
}
