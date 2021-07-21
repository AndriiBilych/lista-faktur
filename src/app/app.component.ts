import {Component, OnInit} from '@angular/core';
import {DataService} from "./services/data.service";
import {InvoiceModel} from "./Models/invoice.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'lista-faktur';
  invoices: InvoiceModel[];

  constructor(private readonly dataService: DataService){
    this.invoices= [];
  }

  ngOnInit() {
    this.dataService.getInvoices().subscribe(data => {
      this.invoices = data;
      this.invoices.sort((first, second) =>
        first.order > second.order ? 1 : first.order < second.order ? -1 : 0
      );
    });
  }
}
