import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {InvoiceModel} from "../../Models/invoice.model";
import {TableStoreService} from "../../services/table-store.service";
import {ModalService} from "../../services/modal.service";
import {ItemModel} from "../../Models/item.model";

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  // TODO: [research] This duplication needs to be solved with generics or correct emitting of multiple data types
  @Input() invoices: InvoiceModel[];
  @Input() selectedInvoices: InvoiceModel[];

  @Output() newInvoices = new EventEmitter<InvoiceModel[]>();
  @Output() newSelectedInvoices = new EventEmitter<InvoiceModel[]>();
  @Output() openModalAction = new EventEmitter();
  isModalOpened: boolean = false;

  constructor() {
    this.invoices = [];
    this.selectedInvoices = [];
  }

  ngOnInit(): void {}

  removeData() {
    if (this.selectedInvoices.length === this.invoices.length) {
      this.newInvoices.emit([]);
      this.newSelectedInvoices.emit([]);
    }
    else {
      for (const select of this.selectedInvoices) {
        const index = this.invoices.findIndex(inv => inv.uid === select.uid)
        this.invoices.splice(index, 1);
      }
      this.newInvoices.emit(this.invoices);
      this.newSelectedInvoices.emit([]);
    }
  }

  findNewId(): number {
    for (let i = 0; i < this.invoices.length; i++) {
      if (this.invoices.findIndex(item => item.id === i) < 0) {
        return i;
      }
    }

    return this.invoices.length;
  }
}
