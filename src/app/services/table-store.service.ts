import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";
import {InvoiceModel} from "../Models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class TableStoreService {
  private _invoicesSource = new ReplaySubject<InvoiceModel[]>();
  private _selectedSource = new ReplaySubject<InvoiceModel[]>();

  invoices$ = this._invoicesSource.asObservable();
  selected$ = this._selectedSource.asObservable();

  constructor() {
    this.clearInvoices();
  }

  setInvoices(data: InvoiceModel[]) {
    this._invoicesSource.next(data);
  }

  setSelected(data: InvoiceModel[]) {
    this._selectedSource.next(data);
  }

  clearInvoices() {
    this._invoicesSource.next([]);
  }

  clearSelected() {
    this._selectedSource.next([]);
  }
}
