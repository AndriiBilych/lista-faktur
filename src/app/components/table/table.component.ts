import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Sort} from "@angular/material/sort";
import {InvoiceModel} from "../../Models/invoice.model";
import {MatTable} from "@angular/material/table";
import {TableStoreService} from "../../services/table-store.service";
import {ModalService} from "../../services/modal.service";
import { v4 as uid} from "uuid";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  invoices: InvoiceModel[]; // holds actual data, is used to bind to
  invoicesHolder: InvoiceModel[]; // stores data for when the filter is applied
  selectedInvoices: InvoiceModel[]; // holds selected rows
  itemsInvoice: InvoiceModel | null; // is used for displaying items table
  newInvoice: InvoiceModel;

  headerColumns: string[] = []; // used for material table controls
  dataColumns: string[] = []; // titles of columns with actual data

  isTableSaved: boolean = false;
  isInputFormOpen: boolean = false;
  isEditingInputForm: boolean = false;

  @ViewChild('table') table: MatTable<InvoiceModel> | undefined;

  constructor(
    private readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
  ) {
    this.newInvoice = new InvoiceModel();
    this.invoices = [];
    this.invoicesHolder = [];
    this.selectedInvoices = [];
    this.itemsInvoice = null;

    // Headers setup
    const filteredColumns = Object.keys(new InvoiceModel()).filter(item => item !== 'uid' && item !== 'items');
    this.dataColumns = [...filteredColumns];
    this.headerColumns = ['select', ...this.dataColumns];
  }

  ngOnInit(): void {
    this.tableStoreService.invoices$.subscribe(data => {
      this.invoices = data

      if (this.selectedInvoices.length > 0) {
        this.selectedInvoices = this.selectedInvoices.filter(item => this.invoices.find(invoice => invoice.uid === item.uid));
      }

      if (this.invoicesHolder.length > 0) {
        this.invoicesHolder = this.invoicesHolder.filter(item => this.invoices.find(invoice => invoice.uid === item.uid));

        const filterValue = (document.getElementById('filter') as HTMLInputElement).value;

        // filter values again after updating the data when filter is not empty
        this.invoices = this.invoicesHolder.filter(item => {
          const subject = `${item.id.toString()} ${item.contractor.toLowerCase()} ${item.title.toLowerCase()} ${item.comment.toLowerCase()} ${item.date.toLowerCase()}`;
          return RegExp(filterValue.toLowerCase()).test(subject)
        });
      }

      this.table?.renderRows();
    });

    this.tableStoreService.selected$.subscribe(data => this.selectedInvoices = data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 0) {
      if (!this.isTableSaved) {
        // backup the data
        this.invoicesHolder = [...this.invoices];
        this.isTableSaved = true;
      }

      this.invoices = this.invoices.filter(item => {
        const subject = `${item.id.toString()} ${item.contractor.toLowerCase()} ${item.title.toLowerCase()} ${item.comment.toLowerCase()} ${item.date.toLowerCase()}`;
        return RegExp(filterValue.toLowerCase()).test(subject)
      });

    }
    else {
      if (this.isTableSaved) {
        // restore the backup
        this.invoices = [...this.invoicesHolder];
        this.invoicesHolder = [];
        this.tableStoreService.setInvoices(this.invoices)
        this.isTableSaved = false;
      }
    }
  }

  // When pressed on the checkbox
  toggle(event: any, row: InvoiceModel) {
    if (event.checked) {
      this.selectedInvoices.push(row)
    }
    else {
      const index = this.selectedInvoices.findIndex(item => item.uid === row.uid)
      this.selectedInvoices.splice(index, 1);
    }

    this.tableStoreService.setSelected(this.selectedInvoices);
  }

  containsByUid(uid: string) {
    return !!this.selectedInvoices.find(item => item.uid === uid);
  }

  // Select all rows
  masterToggle(event: any) {
    this.selectedInvoices = (event.checked ? [...this.invoices] : []);
    this.tableStoreService.setSelected(this.selectedInvoices);
  }

  sortInvoices(sort: Sort) {
    const data = [...this.invoices];
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.invoices = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'contractor': return compare(a.contractor, b.contractor, isAsc);
        case 'title': return compare(a.title, b.title, isAsc);
        case 'comment': return compare(a.comment, b.comment, isAsc);
        case 'date': return compare(a.date.toString(), b.date.toString(), isAsc);
        default: return 0;
      }
    });

    this.tableStoreService.setInvoices(this.invoices);
  }

  clearFilter(event: MouseEvent) {
    event.stopPropagation();
    if (this.isTableSaved) {
      // restore the backup
      this.invoices = [...this.invoicesHolder];
      this.invoicesHolder = [];
      this.tableStoreService.setInvoices(this.invoices)
      this.isTableSaved = false;
      (document.getElementById('filter') as HTMLInputElement).value = '';
    }
  }

  createModal() {
    this.modalService.createModal(this.findNewId());
  }

  findNewId(): number {
    for (let i = 0; i < this.invoices.length; i++) {
      if (this.invoices.findIndex(item => item.id === i) < 0) {
        return i;
      }
    }

    return this.invoices.length;
  }

  log(item: any) {
    console.log(item);
  }

  addInvoice(invoice: InvoiceModel) {
    this.invoices.push(invoice);
    this.table?.renderRows();
  }

  setInvoices(event: InvoiceModel[]) {
    this.invoices = [...event];
  }

  setSelectedInvoices(event: InvoiceModel[]) {
    this.selectedInvoices = [...event];
  }

  modifyInvoice(invoice: InvoiceModel) {
    const index = this.invoices.findIndex(item => item.id === invoice.id)
    this.invoices[index] = Object.assign({}, invoice);
    this.table?.renderRows();
  }

  duplicateInvoice(invoice: InvoiceModel) {
    const index = this.invoices.findIndex(item => item.uid === invoice.uid);
    invoice.id = this.findNewId();
    invoice.uid = uid();

    this.invoices.splice(index + 1, 0, invoice);
    this.table?.renderRows();
  }

  removeInvoice(invoice: InvoiceModel) {
    const index = this.invoices.findIndex(item => item.uid === invoice.uid);
    this.invoices.splice(index, 1);
    this.table?.renderRows();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
