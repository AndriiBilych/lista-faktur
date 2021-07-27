import {Component, HostListener, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {InvoiceModel} from "../../Models/invoice.model";
import {ItemModel} from "../../Models/item.model";
import {Sort} from "@angular/material/sort";
import {v4 as uid} from "uuid";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {

  @Input() invoice: InvoiceModel;
  @Output() closeAction = new EventEmitter();

  selectedItems: ItemModel[]; // stores selected items
  itemsHolder: ItemModel[]; // stores data for when the filter is applied
  newItem: ItemModel;

  headerColumns: string[]; // used for material table controls
  dataColumns: string[]; // titles of columns with actual data

  isTableSaved: boolean = false;
  isEditingInputForm: boolean = false;
  isInputFormOpen: boolean = false;

  @ViewChild('table') table: MatTable<InvoiceModel> | undefined;

  constructor() {
    this.invoice = new InvoiceModel();
    this.selectedItems = [];
    this.itemsHolder = [];
    this.headerColumns = [];
    this.dataColumns = [];
    this.newItem = new ItemModel();
  }

  ngOnInit(): void {
    // Headers setup
    const filteredColumns = Object.keys(new ItemModel()).filter(item => item !== 'uid');
    this.dataColumns = [...filteredColumns];
    this.headerColumns = ['select', ...this.dataColumns];
  }

  @HostListener('document:click', ['$event.target'])
  clicked(target: HTMLElement) {
    if (target.classList.contains('modal-container')) {
      this.closeAction.emit();
    }
  }

  applyFilter(event: Event) {
    //TODO: search isn't always correctly showing results
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length > 0) {
      if (!this.isTableSaved) {
        // backup the data
        this.itemsHolder = [...this.invoice.items];
        this.isTableSaved = true;
      }

      this.invoice.items = this.invoice.items.filter(item => {
        const subject = `${item.id.toString()} ${item.description.toLowerCase()} ${item.netto.toString()}`;
        return RegExp(filterValue.toLowerCase()).test(subject)
      });

    }
    else {
      if (this.isTableSaved) {
        // restore the backup
        this.invoice.items = [...this.itemsHolder];
        this.itemsHolder = [];
        this.isTableSaved = false;
      }
    }
  }

  // When pressed on the checkbox
  toggle(event: any, row: ItemModel) {
    if (event.checked) {
      this.selectedItems.push(row)
    }
    else {
      const index = this.selectedItems.findIndex(item => item.uid === row.uid)
      this.selectedItems.splice(index, 1);
    }
  }

  // When pressed on the entire row
  toggleRow(row: ItemModel) {
    const index = this.selectedItems.findIndex(item => item.uid === row.uid)

    if (index === -1) {
      this.selectedItems.push(row)
    }
    else {
      this.selectedItems.splice(index, 1);
    }
  }

  containsByUid(uid: string) {
    return !!this.selectedItems.find(item => item.uid === uid);
  }

  // Select all rows
  masterToggle(event: any) {
    this.selectedItems = (event.checked ? [...this.invoice.items] : []);
  }

  sortInvoices(sort: Sort) {
    if (this.invoice) {
      const data = [...this.invoice.items];
      if (!sort.active || sort.direction === '') {
        return;
      }

      this.invoice.items = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'id': return compare(a.id, b.id, isAsc);
          case 'description': return compare(a.description, b.description, isAsc);
          case 'netto': return compare(a.netto, b.netto, isAsc);
          case 'vat': return compare(a.vat, b.vat, isAsc);
          default: return 0;
        }
      });
    }
  }

  clearFilter(event: MouseEvent) {
    event.stopPropagation();
    if (this.isTableSaved) {
      // restore the backup
      this.invoice.items = [...this.itemsHolder];
      this.itemsHolder = [];
      this.isTableSaved = false;
      (document.getElementById('items-filter') as HTMLInputElement).value = '';
    }
  }

  setItems(event: ItemModel[]) {
    this.invoice.items = [...event];
  }

  setSelectedItems(event: ItemModel[]) {
    this.selectedItems = [...event];
  }

  addInvoice(item: ItemModel) {
    this.invoice.items.push(item);
    this.table?.renderRows();
  }

  modifyInvoice(item: ItemModel) {
    const index = this.invoice.items.findIndex(item => item.id === item.id)
    this.invoice.items[index] = Object.assign({}, item);
    this.table?.renderRows();
  }

  duplicateInvoice(item: ItemModel) {
    const index = this.invoice.items.findIndex(item => item.uid === item.uid);
    item.id = this.findNewId();
    item.uid = uid();

    this.invoice.items.splice(index + 1, 0, item);
    this.table?.renderRows();
  }

  removeInvoice(item: ItemModel) {
    const index = this.invoice.items.findIndex(item => item.uid === item.uid);
    this.invoice.items.splice(index, 1);
    this.table?.renderRows();
  }

  findNewId(): number {
    for (let i = 0; i < this.invoice.items.length; i++) {
      if (this.invoice.items.findIndex(item => item.id === i) < 0) {
        return i;
      }
    }

    return this.invoice.items.length;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
