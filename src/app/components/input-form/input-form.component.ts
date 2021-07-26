import {Component, HostListener, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {InvoiceModel} from "../../Models/invoice.model";
import {TableStoreService} from "../../services/table-store.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit, OnDestroy {

  @Output() closeAction = new EventEmitter();

  formGroup: FormGroup;
  invoice: InvoiceModel;
  invoices: InvoiceModel[];

  subscription: Subscription;
  isEdit: boolean = false;
  isSubmitted: boolean = false;

  constructor(
    readonly tableStoreService: TableStoreService,
    readonly modalService: ModalService,
    private readonly fb: FormBuilder,
  ) {
    this.subscription = new Subscription();
    this.invoices = [];
    this.invoice = new InvoiceModel();
    this.formGroup = this.fb.group({
      id: new FormControl('', Validators.required),
      contractor: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
      netto: new FormControl('', Validators.required),
      vat: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.subscription.add(this.tableStoreService.invoices$.subscribe(data => this.invoices = data));
    this.subscription.add(this.modalService.modalValue$.subscribe(value => this.invoice = value));
    this.subscription.add(this.modalService.isEdit$.subscribe(value => {
      this.isEdit = value;
      if (this.isEdit) {
        this.formGroup.setValue({
          id: this.invoice.id,
          contractor: this.invoice.contractor,
          title: this.invoice.title,
          comment: this.invoice.comment,
          netto: this.invoice.netto,
          vat: this.invoice.vat,
          date: this.invoice.date,
        });
      }
      else {
        this.formGroup = this.fb.group({
          id: new FormControl('', Validators.required),
          contractor: new FormControl('', Validators.required),
          title: new FormControl('', Validators.required),
          comment: new FormControl('', Validators.required),
          netto: new FormControl('', Validators.required),
          vat: new FormControl('', Validators.required),
          date: new FormControl('', Validators.required),
        })
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('document:click', ['$event.target'])
  clicked(eventTarget: HTMLElement) {
    if (eventTarget.id === 'input-form-modal-container') {
      this.closeAction.emit();
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    const newInvoice = new InvoiceModel(
      this.formGroup.value.id,
      this.invoice.uid,
      this.formGroup.value.contractor,
      this.formGroup.value.title,
      this.formGroup.value.comment,
      this.formGroup.value.netto,
      this.formGroup.value.vat,
      this.invoice.order,
      this.formGroup.value.date.toString(),
    );

    this.isSubmitted = true;
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.valid) {
      if (!this.isEdit) {
        this.invoices.push(newInvoice);
      }
      else {
        const index = this.invoices.findIndex(item => item.uid === this.invoice.uid);
        this.invoices[index] = newInvoice;
      }
      this.tableStoreService.setInvoices(this.invoices);
      this.closeAction.emit();
      this.subscription.unsubscribe();
    }
  }
}
