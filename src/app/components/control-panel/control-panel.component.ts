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
  @Input() items: ItemModel[];
  @Input() selectedInvoices: InvoiceModel[];
  @Input() selectedItems: ItemModel[];
  @Input() isInvoices: boolean = true; // true - invoices, false - items

  @Output() newInvoices = new EventEmitter<InvoiceModel[]>();
  @Output() newItems = new EventEmitter<ItemModel[]>();
  @Output() newSelectedInvoices = new EventEmitter<InvoiceModel[]>();
  @Output() newSelectedItems = new EventEmitter<ItemModel[]>();
  @Output() openModalAction = new EventEmitter();
  isModalOpened: boolean = false;

  constructor(
    // private readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
  ) {
    this.invoices = [];
    this.items = [];
    this.selectedInvoices = [];
    this.selectedItems = [];
  }

  ngOnInit(): void {
    // this.tableStoreService.invoices$.subscribe(data => {
    //   this.invoices = data

      // this.selected.filter(item => this.invoices.find(invoice => invoice.uid === item.uid));
    // });

    // this.tableStoreService.selected$.subscribe(data => this.selected = data);
  }

  removeData() {
    if (this.selectedInvoices.length === this.invoices.length) {
      this.newInvoices.emit([]);
      // this.invoices = [];
      this.newSelectedInvoices.emit([]);
      // this.selectedInvoices = [];
    }
    else {
      for (const select of this.selectedInvoices) {
        const index = this.invoices.findIndex(inv => inv.uid === select.uid)
        this.invoices.splice(index, 1);
      }
      this.newInvoices.emit(this.invoices);
      this.newSelectedInvoices.emit([]);
      // this.selectedInvoices = [];
      // this.tableStoreService.setInvoices(this.invoices);
      // this.tableStoreService.clearSelected();
    }
    // console.log(this.data, this.selectedData)
  }

  createModal() {
    this.openModalAction.emit();
    // if (this.isInvoices) {
    //   this.modalService.createModal(this.findNewId());
    // }
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
