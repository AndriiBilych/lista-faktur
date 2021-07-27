import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ItemModel} from "../../Models/item.model";

@Component({
  selector: 'app-items-input-form',
  templateUrl: './items-input-form.component.html',
  styleUrls: ['./items-input-form.component.scss']
})
export class ItemsInputFormComponent implements OnInit {

  @Input() isEdit: boolean = false;
  @Input() newId: number = 0;
  @Input() item: ItemModel;

  @Output() closeAction = new EventEmitter();
  @Output() submitAction = new EventEmitter();

  formGroup: FormGroup;

  isSubmitted: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
  ) {
    console.log('constructor');
    this.item = new ItemModel();
    this.formGroup = this.fb.group({
      id: new FormControl({value: '', disabled: true}),
      description: new FormControl('', Validators.required),
      netto: new FormControl('', Validators.required),
      vat: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    console.log('onInit');
    if (this.isEdit) {
      this.formGroup.setValue({
        id: this.item.id,
        description: this.item.description,
        netto: this.item.netto,
        vat: this.item.vat,
      });
    }
    else {
      this.formGroup.setValue({
        id: this.newId,
        description: '',
        netto: '',
        vat: '',
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
    const newInvoice = new ItemModel(
      this.isEdit ? this.item.id : this.newId,
      this.item.uid,
      this.formGroup.value.description,
      this.formGroup.value.netto,
      this.formGroup.value.vat,
    );

    this.isSubmitted = true;
    this.formGroup.updateValueAndValidity();

    if (this.formGroup.valid) {
      this.submitAction.emit(newInvoice);
      this.closeAction.emit();
    }
  }

}
