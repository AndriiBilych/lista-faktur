import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "./services/data.service";
import {InvoiceModel} from "./Models/invoice.model";
import {Sort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  invoices: InvoiceModel[];

  headerColumns: string[] = []; // used for material table controls
  dataColumns: string[] = []; // titles of columns with actual data

  selected: InvoiceModel[];

  @ViewChild('table') table: MatTable<InvoiceModel> | undefined;

  constructor(
    private readonly dataService: DataService
  ) {
    this.invoices = [];
    this.selected = [];
    const filteredColumns = Object.keys(new InvoiceModel()).filter(item => item !== 'uid');
    this.dataColumns = [...filteredColumns];
    this.headerColumns = ['select', ...this.dataColumns];
  }

  ngOnInit() {
    this.dataService.getInvoices().subscribe(data => {
      this.invoices = data;
    });
  }

  toggle(event: any, row: InvoiceModel) {
    if (event.checked) {
      this.selected.push(row)
    }
    else {
      const index = this.selected.findIndex(item => item.uid === row.uid)
      this.selected.splice(index, 1);
    }
  }

  containsByUid(uid: string) {
    return !!this.selected.find(item => item.uid === uid);
  }

  masterToggle(event: any) {
    event.checked ? this.selected = [...this.invoices] : this.selected = [];
  }

  addData() {
    this.invoices.push(new InvoiceModel());
    this.table?.renderRows();
  }

  removeData() {
    if (this.selected.length === 0) {
      this.invoices.pop();
      this.table?.renderRows();
    }
    else if (this.selected.length === this.invoices.length) {
      this.invoices = [];
      this.selected = [];
    }
    else {
      for (const select of this.selected) {
        const index = this.invoices.findIndex(inv => inv.uid === select.uid)
        this.invoices.splice(index, 1);
      }
      this.selected = [];
      this.table?.renderRows()
    }
  }

  clearData() {
    this.invoices = [];
    this.table?.renderRows();
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
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
