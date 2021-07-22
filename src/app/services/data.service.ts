import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {InvoiceModel} from "../Models/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url: string = 'assets/invoices.json';

  constructor(private readonly http: HttpClient) { }

  getInvoices(): Observable<InvoiceModel[]> {
    return this.http.get<InvoiceModel[]>(this.url).pipe(map((data) => {
      return data.map((item) => new InvoiceModel().deserialize(item));
    }));
  }
}
