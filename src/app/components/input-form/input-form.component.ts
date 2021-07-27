import {Component, HostListener, OnDestroy, OnInit, Output, EventEmitter, Input} from '@angular/core';
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
export class InputFormComponent implements OnInit {

  @Input() isEdit: boolean = false;
  @Input() newId: number = 0;
  @Input() invoice: InvoiceModel;

  @Output() closeAction = new EventEmitter();
  @Output() submitAction = new EventEmitter();

  formGroup: FormGroup;

  subscription: Subscription;
  isSubmitted: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
  ) {
    this.subscription = new Subscription();
    this.invoice = new InvoiceModel();
    this.formGroup = this.fb.group({
      id: new FormControl({value: '', disabled: true}),
      contractor: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this.formGroup.setValue({
        id: this.invoice.id,
        contractor: this.invoice.contractor,
        title: this.invoice.title,
        comment: this.invoice.comment,
        date: this.invoice.date,
      });
    }
    else {
      this.formGroup.setValue({
        id: this.newId,
        contractor: '',
        title: '',
        comment: '',
        date: '',
      })
    }
  }

  @HostListener('document:click', ['$event.target'])
  clicked(eventTarget: HTMLElement) {
    if (eventTarget.id === 'input-form-modal-container') {
      this.closeAction.emit();
    }
  }

  onSubmit() {
    const newInvoice = new InvoiceModel(
      this.isEdit ? this.invoice.id : this.newId,
      this.invoice.uid,
      this.formGroup.value.contractor,
      this.formGroup.value.title,
      this.formGroup.value.comment,
      this.formGroup.value.date.toString(),
    );

    this.isSubmitted = true;
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.valid) {
      this.submitAction.emit(newInvoice);
      this.closeAction.emit();
    }
  }
}
