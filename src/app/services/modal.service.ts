import { Injectable } from '@angular/core';
import {ReplaySubject} from "rxjs";
import {InvoiceModel} from "../Models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _modalValue = new ReplaySubject<InvoiceModel>();
  private _isEdit = new ReplaySubject<boolean>();

  isEdit$ = this._isEdit.asObservable();
  modalValue$ = this._modalValue.asObservable();

  constructor() {
    this._modalValue.next(undefined);
    this._isEdit.next(false);
  }

  createModal() {
    this._modalValue.next(new InvoiceModel());
    this._isEdit.next(false);
  }

  editModal(invoice: InvoiceModel) {
    this._modalValue.next(invoice);
    this._isEdit.next(true);
  }

  closeModal() {
    this._modalValue.next(undefined);
    this._isEdit.next(false);
  }
}
