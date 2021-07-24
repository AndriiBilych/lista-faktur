import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";
import {InvoiceModel} from "../Models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class TableStoreService {
  private _tableSource = new ReplaySubject<InvoiceModel[]>();
  table$ = this._tableSource.asObservable();

  constructor() {
    this.clearTable();
  }

  setTable(data: InvoiceModel[]) {
    this._tableSource.next(data);
  }

  clearTable() {
    this._tableSource.next([]);
  }
}
