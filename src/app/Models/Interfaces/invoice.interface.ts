import {ItemInterface} from "./item.interface";

export interface InvoiceInterface {
  id: number;
  uid: string;
  contractor: string;
  title: string;
  comment: string;
  date: string;
  items: ItemInterface[];
}
