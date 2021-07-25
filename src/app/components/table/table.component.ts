import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Sort} from "@angular/material/sort";
import {InvoiceModel} from "../../Models/invoice.model";
import {MatTable} from "@angular/material/table";
import {TableStoreService} from "../../services/table-store.service";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  invoices: InvoiceModel[]; // holds actual data, is used to bind to
  invoicesHolder: InvoiceModel[]; // stores data for when the filter is applied
  selected: InvoiceModel[]; // holds selected rows

  headerColumns: string[] = []; // used for material table controls
  dataColumns: string[] = []; // titles of columns with actual data

  isTableSaved: boolean = false;

  @ViewChild('table') table: MatTable<InvoiceModel> | undefined;

  constructor(
    private readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
  ) {
    this.invoices = [];
    this.invoicesHolder = [];
    this.selected = [];

    // Headers setup
    const filteredColumns = Object.keys(new InvoiceModel()).filter(item => item !== 'uid' && item !== 'order');
    this.dataColumns = [...filteredColumns];
    this.headerColumns = ['select', ...this.dataColumns];
  }

  ngOnInit(): void {
    this.tableStoreService.invoices$.subscribe(data => {
      this.invoices = data

      if (this.selected.length > 0) {
        this.selected = this.selected.filter(item => this.invoices.find(invoice => invoice.uid === item.uid));
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

    this.tableStoreService.selected$.subscribe(data => this.selected = data);
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

      // this.tableStoreService.setInvoices(this.invoices);
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
      this.selected.push(row)
    }
    else {
      const index = this.selected.findIndex(item => item.uid === row.uid)
      this.selected.splice(index, 1);
    }

    this.tableStoreService.setSelected(this.selected);
  }

  // When pressed on the entire row
  toggleRow(row: InvoiceModel) {
    const index = this.selected.findIndex(item => item.uid === row.uid)

    if (index === -1) {
      this.selected.push(row)
    }
    else {
      this.selected.splice(index, 1);
    }

    this.tableStoreService.setSelected(this.selected);
  }

  containsByUid(uid: string) {
    return !!this.selected.find(item => item.uid === uid);
  }

  // Select all rows
  masterToggle(event: any) {
    this.selected = (event.checked ? [...this.invoices] : []);
    this.tableStoreService.setSelected(this.selected);
  }

  sortData(sort: Sort) {
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
        case 'netto': return compare(a.netto, b.netto, isAsc);
        case 'vat': return compare(a.vat, b.vat, isAsc);
        case 'date': return compare(a.date.toString(), b.date.toString(), isAsc);
        case 'order': return compare(a.order, b.order, isAsc);
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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
