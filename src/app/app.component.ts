import {Component, OnInit} from '@angular/core';
import {DataService} from "./services/data.service";
import {TableStoreService} from "./services/table-store.service";
import {ModalService} from "./services/modal.service";
import {InvoiceModel} from "./Models/invoice.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  modalValue: InvoiceModel | undefined;

  constructor(
    private readonly dataService: DataService,
    private readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
  ) {}

  ngOnInit() {
    this.dataService.getInvoices().subscribe(data => {
      this.tableStoreService.setInvoices(data);
    });

    this.modalService.modalValue$.subscribe( value => this.modalValue = value);
  }
}
