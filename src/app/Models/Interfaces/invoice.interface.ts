export interface InvoiceInterface {
  id: number;
  uid: string;
  contractor: string;
  title: string;
  comment: string;
  netto: number;
  vat: number;
  order: number;
  date: string;
}
