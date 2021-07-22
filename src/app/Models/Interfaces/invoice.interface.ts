export interface InvoiceInterface {
  id: number;
  contractor: string;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: string;
}
