import { Component, OnInit } from '@angular/core';
import {InvoiceModel} from "../../Models/invoice.model";
import {TableStoreService} from "../../services/table-store.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  invoices: InvoiceModel[];
  selected: InvoiceModel[];

  constructor(
    private readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
  ) {
    this.invoices = [];
    this.selected = [];
  }

  ngOnInit(): void {
    this.tableStoreService.invoices$.subscribe(data => {
      this.invoices = data

      this.selected.filter(item => this.invoices.find(invoice => invoice.uid === item.uid));
    });

    this.tableStoreService.selected$.subscribe(data => this.selected = data);
  }

  removeData() {
    if (this.selected.length === this.invoices.length) {
      this.tableStoreService.clearInvoices();
      this.tableStoreService.clearSelected();
    }
    else {
      for (const select of this.selected) {
        const index = this.invoices.findIndex(inv => inv.uid === select.uid)
        this.invoices.splice(index, 1);
      }
      this.tableStoreService.setInvoices(this.invoices);
      this.tableStoreService.clearSelected();
    }
  }
}
