import {Component, HostListener, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {InvoiceModel} from "../../Models/invoice.model";
import {ItemModel} from "../../Models/item.model";
import {Sort} from "@angular/material/sort";

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {

  @Input() invoice: InvoiceModel;
  @Output() closeAction = new EventEmitter();

  selectedItems: ItemModel[];

  headerColumns: string[]; // used for material table controls
  dataColumns: string[]; // titles of columns with actual data

  constructor() {
    this.invoice = new InvoiceModel();
    this.selectedItems = [];
    this.headerColumns = [];
    this.dataColumns = [];
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

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (filterValue.length > 0) {
  //     if (!this.isTableSaved) {
  //       // backup the data
  //       this.invoicesHolder = [...this.invoices];
  //       this.isTableSaved = true;
  //     }
  //
  //     this.invoices = this.invoices.filter(item => {
  //       const subject = `${item.id.toString()} ${item.contractor.toLowerCase()} ${item.title.toLowerCase()} ${item.comment.toLowerCase()} ${item.date.toLowerCase()}`;
  //       return RegExp(filterValue.toLowerCase()).test(subject)
  //     });
  //
  //   }
  //   else {
  //     if (this.isTableSaved) {
  //       // restore the backup
  //       this.invoices = [...this.invoicesHolder];
  //       this.invoicesHolder = [];
  //       this.tableStoreService.setInvoices(this.invoices)
  //       this.isTableSaved = false;
  //     }
  //   }
  // }
  //
  // When pressed on the checkbox
  toggle(event: any, row: ItemModel) {
    if (event.checked) {
      this.selectedItems.push(row)
    }
    else {
      const index = this.selectedItems.findIndex(item => item.uid === row.uid)
      this.selectedItems.splice(index, 1);
    }

    // this.tableStoreService.setSelected(this.selectedItems);
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

    // this.tableStoreService.setSelected(this.selectedItems);
  }

  containsByUid(uid: string) {
    return !!this.selectedItems.find(item => item.uid === uid);
  }

  // Select all rows
  masterToggle(event: any) {
    this.selectedItems = (event.checked ? [...this.invoice.items] : []);
    // this.tableStoreService.setSelected(this.selectedItems);
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

      // this.tableStoreService.setInvoices(this.invoices);
    }
  }

  // clearFilter(event: MouseEvent) {
  //   event.stopPropagation();
  //   if (this.isTableSaved) {
  //     // restore the backup
  //     this.invoices = [...this.invoicesHolder];
  //     this.invoicesHolder = [];
  //     this.tableStoreService.setInvoices(this.invoices)
  //     this.isTableSaved = false;
  //     (document.getElementById('filter') as HTMLInputElement).value = '';
  //   }
  // }

  // createModal() {
  //   this.modalService.createModal(this.findNewId());
  // }

  // findNewId(): number {
  //   for (let i = 0; i < this.invoices.length; i++) {
  //     if (this.invoices.findIndex(item => item.id === i) < 0) {
  //       return i;
  //     }
  //   }
  //
  //   return this.invoices.length;
  // }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
