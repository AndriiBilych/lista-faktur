import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InvoiceInterface} from "../Models/Interfaces/invoice.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url: string = 'assets/invoices.json';

  constructor(private readonly http: HttpClient) { }

  getInvoices(): Observable<InvoiceInterface[]> {
    return this.http.get<InvoiceInterface[]>(this.url);
  }
}
